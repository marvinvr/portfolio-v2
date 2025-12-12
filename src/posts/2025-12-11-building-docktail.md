---
title: Building DockTail - Zero-Config Docker to Tailscale Integration
description: I built DockTail to automatically expose Docker containers as Tailscale Services using labels.
date: "2025-12-11"
categories:
  - docker
  - networking
  - open-source
published: true
header: header.jpg
---


I run a handful of self-hosted services on my home Server(s). They're all containerized with Docker, which makes deployment and management pretty straightforward. To securely access them from anywhere, I've been using Tailscale for quite some time now. It creates a private network between all my devices, so I can reach my services from my laptop, phone, or any other device without exposing them to the public internet, which is pretty cool. This works great for accessing hosts but doesn't really solve the problem of easily accessing the services that run on these hosts. For that, I still had to run a reverse proxy and DNS server somewhere on my network that the whole system relied on. If that was down or misconfigured in some way, I couldn't access my services. I've been using Traefik and Pihole for that for some time, which worked alright but didn't really offer that _magic_ experience from the Tailscale world... Until now!

## Enter: Tailscale Services


Tailscale has recently released a feature called "Services" that basically lets you expose services running on your machines to your entire tailnet with nice, clean URLs. So instead of remembering `http://my-machine-name:8080`, I could just type `http://myservice` from anywhere. Now that's the kind of magic I was looking for!

The problem is, that every single service needs to be set up manually. So my routine would go like this: deploy a new container, SSH into the server, run `tailscale serve --service=svc:myservice --https=443 127.0.0.1:8080`. This felt a bit tidious and error prone, especially considering that if I remove the container, I have to remember to remove the service from Tailscale as well.

For a few containers, this was just mildly annoying. But when you're managing a dozen or more services that get updated regularly, it becomes a real pain. And it kind of defeats the whole purpose of using Docker Compose in the first place. I wanted my infrastructure defined in yaml files, not scattered across random shell commands I ran in the middle of the night.

## The "Why Can't This Just Work?" Moment

If you've ever used Traefik or Caddy with Docker, you know that feeling when you add a couple labels to a container and everything just... works. The reverse proxy picks it up, sets up routing, handles TLS certificates, all of it. You don't SSH anywhere or edit some random config file, you just update your compose file and deploy.

```yaml
services:
  myapp:
    image: myapp:latest
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.myapp.rule=Host(`myapp.example.com`)"
```

That's what I wanted for Tailscale Services. But Tailscale doesn't have any Docker integration. It's designed to be configured manually through their CLI or admin console. Which makes sense for most use cases, but when you're running a homelab where everything is containerized, it feels like a gap that shouldn't exist.

So I decided to build something to fill it.

## What DockTail Does

The concept is pretty straightforward: DockTail watches Docker for containers with specific labels and automatically configures Tailscale Services for them. When a container starts, DockTail tells Tailscale to expose it. When it stops, DockTail cleans it up. That's it.

Here's what it looks like:

```yaml
services:
  myapp:
    image: myapp:latest
    ports:
      - "8080:8080"
    labels:
      - "docktail.enable=true"
      - "docktail.service=myapp"
      - "docktail.port=8080"
```

You deploy that container, and `http://myapp` is immediately accessible on your tailnet. Everything lives in your compose file where it belongs. No SSH, no manual commands to remember or forget. And you don't even need to manage separate Sidecar containers or auth sessions for your containers. It all uses your host's Tailscale authentication.

## How It Works

Under the hood, DockTail is basically doing a continuous loop of checking what's running and making sure Tailscale knows about it. For every running container, DockTail looks for labels like `docktail.enable=true`. If it finds them, it reads the config from the other labels: what to call the service, which port to expose, what protocol to use (HTTP, HTTPS, or TCP), and whether to enable Tailscale Funnel for public access (yea, it can do that too, pretty cool, right?).

Once it knows all that, DockTail talks to Tailscale (via the Tailscale socket) and tells it to set up the service. Basically doing what `tailscale serve --service=svc:myservice --https=443 127.0.0.1:8080` does, but programmatically. The whole thing is stateless—DockTail doesn't keep a database or config files. It just looks at what Docker says is running and what Tailscale thinks is exposed, and makes them match. So you can restart DockTail anytime and it'll pick right back up.

## Why Go?

I went with Go for a few reasons that made the project way easier. The Docker SDK for Go is really solid. It's well-maintained, has everything you need, and makes watching container events and querying metadata pretty straightforward. Also, Go's concurrency model made it easy to handle Docker events in the background while also running periodic reconciliation checks—just spin up a few goroutines.

Oh, and the deployment story is great. The whole thing compiles to a single static binary that runs in a tiny ~50mb Alpine Linux container.

## Real World Example: MinIO Object Storage

Here's how I'm actually using DockTail in practice. If you want to run MinIO as your S3-compatible object storage for backups and file storage, you would probably want to expose the API publicly and the admin console privately. MinIO has two interfaces: the API (port 9000) that applications use to store and retrieve files, and the admin console (port 9001) for managing buckets and users.

The API needs to be accessible from various services and sometimes from outside your Tailnet. But the admin console should only be accessible from your own devices.

So all you need to do is add a few labels to your MinIO container and run DockTail alongside it:

```yaml
services:
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: supersecret
    volumes:
      - ./data:/data
    labels:
      # Admin console - private on tailnet only
      - "docktail.enable=true"
      - "docktail.service=minio-console"
      - "docktail.port=9001"
      # API - public via Funnel for external access
      - "docktail.funnel.enable=true"
      - "docktail.funnel.port=9000"
      - "docktail.funnel.protocol=https"
    
  docktail:
    image: marvinvr/docktail:latest
    container_name: docktail
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/run/tailscale/tailscaled.sock:/var/run/tailscale/tailscaled.sock
    restart: unless-stopped
```

With this setup, you can access the admin console at `http://minio-console` from any device on your tailnet—laptop, phone, whatever. But the API is exposed publicly via Tailscale Funnel, so your applications can reach it from anywhere. No reverse proxy, no DNS configuration, no firewall rules. Just Docker labels.

## Things to Know Before You Use It

There are a few limitations worth mentioning:

**Ports have to be published** – This is actually a Tailscale thing, not a DockTail thing. Tailscale's serve command only works with localhost, so containers have to publish their ports to the host. You can't just use Docker's internal networking. For me, this is a minor inconvenience, but you need to know about it going in.

**You need to pre-configure services** – Before DockTail can use a service name, you have to set it up once in the Tailscale admin console. It's a one-time thing, but it means it's not _completely_ zero-config. I'm looking at ways to automate this, but it might need extra API permissions from Tailscale.

**It only works with Tailscale** – In case that wasn't clear enough, this is built specifically for Tailscale. If you're using WireGuard or something else, it won't help. And I'm not planning to add support for other VPN providers anytime soon. But if you're already on Tailscale, it plugs right in.

## Building It

Building DockTail was pretty straightforward, thanks mostly to Go's libraries. The tricky part was figuring out edge cases—like what happens if a container restarts while DockTail is in the middle of configuring Tailscale? Or if Tailscale is down for a bit? Or if the Tailscale socket is not available for a reason or another?

I ended up using a reconciliation loop approach, similar to how Kubernetes controllers work. Instead of trying to keep everything perfectly in sync all the time, DockTail just periodically checks the actual state and fixes any drift. This makes it resilient to temporary failures and restarts.

I also decided early on to keep DockTail completely stateless. It doesn't write config files or maintain a database. Everything it needs comes from Docker labels and the Tailscale API. So you can restart DockTail whenever you want. It'll just reconcile the current state on startup and keep going.

I made it open source because that's how these tools should work. You can see the code, contribute, or fork it for your own needs. The whole thing is on [GitHub](https://github.com/marvinvr/docktail).

## But why?

I built this because I had a specific problem that annoyed me constantly. That made it easy to stay focused. DockTail does one thing: it bridges Docker and Tailscale with as little config as possible. Since I released it, a few people have reached out with their own use cases and feature ideas, which has been pretty amazing to see.

If you're running Docker and Tailscale, give it a shot. Issues and PRs are welcome on [GitHub](https://github.com/marvinvr/docktail).
