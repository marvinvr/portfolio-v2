---
title: Building my Second Brain - with Obsidian
description: How to use Obsidian to build a second brain and manage your knowledge with ease.
date: '2023-11-22'
categories:
- productivity
published: true
header: header.png
---

<script lang="ts">
    import { image } from "$lib/utils/images";

    const slug = "2023-11-22-building-my-second-brain-with-obsidian";
    const obsidian = image(slug, "obsidian.png");
    const markdown = image(slug, "markdown.png");
    const obsidianInterface = image(slug, "obsidian-interface.png");
    const obsidianGraph = image(slug, "obsidian-graph.png");
    const obsidianLatex = image(slug, "obsidian-latex.png");
    const obsidianProjectsPlugin = image(slug, "obsidian-projects-plugin.png");
    const obsidianProjectsPluginKanban = image(slug, "obsidian-projects-plugin-kanban.png");
    const obsidianTextGeneratorPlugin = image(slug, "obsidian-text-generator-plugin.png");
    const myObsidianVault = image(slug, "my-obsidian-vault.png");
</script>

In today's age of information and continuous learning opportunities, managing and organizing knowledge has never been more paramount. As a data science student and therefore continuous learner, I've tried various applications and systems searching for the perfect tool to capture, store, and make sense of everything I learn. That quest only came to a halt when I learned about Obsidian, a powerful note-taking app that has revolutionized the way I organize my thoughts and ideas. 

Obsidian stands out from other note-taking applications with its combination of simplicity, flexibility, and power. For me, it functions as not just a tool for documentation but as an extension of my cognitive processes – a 'Second Brain' if you will. In this post, I will share how I've leverage Obsidian to elevate my note-taking and how it has made a significant impact on my university life. From its markdown-centric approach to its plugin ecosystem, my work with Obsidian has reshaped my approach to learning and productivity.

## What is Obsidian?
![Obsidian]({obsidian})

For starters, it's essential to understand what Obsidian is at its core. Obsidian is a remarkable note-taking and knowledge management app that allows users to write, and most importantly, organize their notes using a sleek interface.

The magic of Obsidian lies in its use of plain text markdown files to manage notes. Unlike other proprietary formats that lock you into a certain platform, markdown files are portable, future-proof, and can be read by a multitude of editors and applications. This feature ensures that your notes remain accessible outside of Obsidian, giving you the freedom to control and manage your data.

But Obsidian isn’t just a simple markdown editor. It's a hub that connects your thoughts through links, much like the web of neurons in the human brain. You can link notes together, create networks of ideas, and visualize the connections through graph views. This interconnected system not only makes it easy to find relationships between pieces of information but also fosters a more in-depth understanding of how the knowledge is connected.

Additionally, Obsidian is designed to be as unassuming or as complex as you need it to be. With its customizable nature, it works equally well for users seeking a lightweight writing environment, as it does for power users who want to tailor the application to their specific workflow with its robust plugin ecosystem. 

At its heart, Obsidian lies user agency and data ownership. You can store your knowledge vault wherever you prefer. This can be locally on your device or on your chosen cloud service. This means that you have complete control over the safety and privacy of your data. 

Whether you're making quick notes, archiving insights from a research paper, Obsidian provides a rich soil in which the seeds of your knowledge can be sown and nurtured into a knowledge-base that is uniquely yours.

## The Core Advantage: Markdown Format
One of the core advantages of Obsidian lies in its use of Markdown for storing your notes. Markdown is a lightweight markup language with plain text formatting syntax that is designed to be converted to other formats using simple, readable symbols. This feature is what sets Obsidian apart from many other note-taking apps and offers several significant benefits.

Firstly, Markdown is incredibly user-friendly and easy to pick up, even for those who are not tech-savvy. If you can type, you can use Markdown. This simplicity allows for rapid note-taking without the overhead of navigating complex formatting menus and options, which can interrupt the flow of thought during writing sessions.

![Markdown]({markdown})

In addition to that, unlike proprietary formats used by many note-taking apps, Markdown files are future-proof and portable. You can open, edit, and manage them with an array of text editors, ensuring your notes remain accessible no matter how your digital tools change. This plays into the philosophy of long-term knowledge retention and management, freeing Obsidian users from the worry of their software becoming obsolete or vendor lock-in, which they might have with other note-taking tools like Notion.

When coupled with Obsidian's linking and graphing capabilities, Markdown becomes a lot more powerful. You can easily create links within your text that bridge concepts and notes, building a web of information that visually and contextually represents the neural networks of your own thinking.

![Obsidian Interface]({obsidianInterface})

Another outstanding aspect, especially for Software Engineers, is the way Markdown pairs with version control systems, such as Git. This combination allows you to track changes over time, easily collaborate, and even roll back to previous versions of your notes if needed.

## Navigating University with Obsidian
Attending university involves managing vast information spanning various subjects. Ensuring this information is organized and easily retrievable can be as crucial as understanding the content itself. Here is where Obsidian has become my go-to tool for note-taking in university.

![Obsidian Graph]({obsidianGraph})

With the ability to interlink notes, I can relate concepts from different lectures or materials, regardless of their chronological order. This method reflects the actual structure of knowledge, where ideas are interconnected rather than isolated topics. By building a network of notes, I effectively have a personalized encyclopedia of my university courses that becomes more and more valuable over time.

Another very impactful feature is its ability to handle different media types. I can integrate images from slides, embed PDFs, and even link audio recordings right within my notes. When it comes to digging deeper into a topic, having all these resources available in one place saves me considerable time. Obsidian also has plugins available to more directly work with different formats. For example, the [Omnisearch Plugin](https://github.com/scambier/obsidian-omnisearch) allows for PDF files to be indexed using Optical Character Recognition and searched through as if they were text files.

![Obsidian LaTeX]({obsidianLatex})


Additionally, Obsidian’s ability to support LaTeX within notes is invaluable for courses relying on equations or mathematical formulations. As a data science student, this is a feature I use in almost all of my notes, and having them rendered within my notes streamlines my study process and truly helps me understand concepts faster.

The result is a robust and organized database of knowledge, which constantly evolves with my academic progress.

## Leveraging the Plugin Ecosystem
The true power of Obsidian as a second brain lies not only in its markdown capabilities or linking features but also in its extensive plugin ecosystem. Obsidian's plugins can cater to very specific workflows. This means you have the flexibility to customize your experience to suit your specific needs, no matter how you like to take your notes.

Plugins for Obsidian support a wide array of functions designed to streamline your note-taking and information management. There are solutions for everything from simple improvements like better text formatting to advanced functionality like automation management. In the following sections, I will delve deeper into two specific plugins, the Projects Plugin and the Text Generator Plugin, which have been particularly helpful in my workflow.

### Projects Plugin
![Projects Plugin]({obsidianProjectsPlugin})

The Projects Plugin in Obsidian is an outstanding tool for people like me, needing to manage various tasks and projects. This plugin leverages the versatility of Markdown to create dynamic data tables that integrate into your existing notes structure.

By storing information in markdown metadata fields, the plugin allows me to store specific task properties within my note's metadata. What's great about this approach is the information remains within markdown files, ensuring that your data remains in the text-based, portable format that makes Obsidian so powerful.

![Projects Plugin Kanban]({obsidianProjectsPluginKanban})

Once the project data is in place, the Projects Plugin provides several views to visualize and interact with your projects. If you prefer a traditional, spreadsheet-like overview, you can opt for the table view. For those who prefer to divide projects by status, the kanban board view turns your projects into movable cards across user-defined columns, which is ideal for larger projects. In addition to those two, the calendar view offers a time-based perspective, making it easy to keep track of upcoming events. 

For a university student like me, working on multiple courses, assignments, and personal projects, at the same time, this can massively help with organization. The Projects Plugin ensures that no detail is lost and that I can stay ahead of my workload.

### Text Generator Plugin
![Text Generator Plugin]({obsidianTextGeneratorPlugin})
*Website*: [Text Generator Plugin](https://text-gen.com/)

The Text Generator Plugin for Obsidian drastically improves efficiency when it comes to information documentation. By integrating OpenAI's language models into my workflow, I can invoke AI text completion with a hotkey. The ability to let the language model take over for boilerplate tasks, really eliminates tedious work when studying. I find the Text Generator to be particularly helpful in bridging the gap between ideas, providing me with a starting point for elaboration and further exploration of a topic.

However, with AI-generated text comes some responsibility. While the language models can produce remarkable content, they are often not a great sources of truth. The information generated must always be fact-checked and verified. This is critical, as incorporating incorrect or misleading information into my notes will lead to confusion or inaccuracies in my understanding of certain topics.

Despite this necessary fact-checking, the Text Generator Plugin is a great asset, allowing me to focus my efforts on learning and synthesizing information rather than getting bogged down in repetitive writing tasks.

## When NOT to use Obsidian
Whilst I do believe that Obsidian is one of if not the best note-taking tool available on the market, there are some disadvantages which you should know about before you make the switch.


### Lacking Tablet support
One such limitation of Obsidian is its lack of native tablet support, particularly when it comes to handwriting input. For many students, the ability to write notes by hand using a stylus is important. For some, it allows for a more familiar note-taking experience, especially during lectures where typing might be disruptive.

Unfortunately, Obsidian doesn't offer built-in functionality for handwriting recognition or the ability to convert pen strokes into text. This means that users who depend heavily on handwritten notes might find Obsidian less accommodating to their needs. The absence of this feature is significant when compared to some of its competitors, such as Notability or Evernote, which have embraced tablet users for a long time. For those reliant on a digital handwriting experience, this might be a deal-breaker, or like me, might need a secondary app as well which they use for handwritten notes.

### Difficulties to sync with iOS devices
Another obstacle for potential Obsidian users comes in the form of synchronization when it involves iOS devices. Apple's iOS ecosystem has restrictions on how data can be stored and accessed. This presents a challenge for Obsidian users who wish to access their vaults across iPhones and iPads.

Unlike some note-taking apps, Obsidian doesn't directly support using cloud storage solutions like iCloud, OneDrive, or Dropbox for synchronization on iOS. The only (somewhat) supported way is to sync via iCloud, which can result in sync conflicts or delays that are very unpredictable, causing frustration.

To reliably sync data across all platforms, including iOS, Obsidian's proprietary Sync service has to be used, which is a paid feature. While the Obsidian Sync service is a robust solution, it does mean incurring an additional recurring subscription of `8$`/mo at the time of writing. Although, they do offer a student discount [here](https://help.obsidian.md/Licenses+and+payment/Education+and+non-profit+discount).

Personally, as someone who utilizes multiple devices for my work, I've opted for subscribing to the Obsidian Sync service, primarily due to its limitations of its syncing within the iOS ecosystem.

## Public Knowledge Base: A Tour of My Obsidian Library
![My Obsidian Valut]({myObsidianVault})

My public Obsidian library offers a view into the essence of what I've learned until now. Located at [docs.marvinvr.ai](https://docs.marvinvr.ai), you can navigate through my personal repository of knowledge. It's a dynamic library, growing with each semester and letting the public see, what I've been learning.

My Obsidian setup constitutes a series of main categories, some of which are divided into further subcategories.

My primary Obsidian Vault is called "Documentation".  Here, you will find a mix of notes on `Code`, `Deep Learning`, `Natural Language Processing`, `Hardware`, and `Maths`. Each of these categories is broken down into more specialized subtopics. For instance, under `Deep Learning`, you can delve into notes covering everything from `Activation Functions` to `Models`.

`Hardware` includes what I'm tinkering with on my spare time. With sections dedicated to `OPNSense`, `Raspberry Pi`, `Ubuntu Server`, and `Unraid`. These notes serve as technical guides based on my personal setup experiences.

*Note:* Parts of my library, specifically the math parts, are written in German, this is due to my education taking place in Switzerland.

## Conclusion
In the landscape of note-taking platforms, Obsidian stands tall for its powerful features, customization options, and robust community. For me, it has proven to be an invaluable tool throughout my university classes, providing a flexible and reliable way to document everything I learn. Its markdown foundation simplifies note creation and ensures that my data remains portable and future-proof.

Moreover, the plugin ecosystem of Obsidian, featuring gems like the Projects and Text Generator plugins, has allowed me to increase my productivity and streamline my workflows. While it does fall short in areas such as tablet support and iOS synchronization, these limitations are outweighed by its overall utility and versatility.

My public Obsidian library not only works as a testament to my learning journey, but also as an accessible resource for anyone curious enough to explore it. Whether you're in academia, like me, or just someone passionate about learning, Obsidian could very well be the platform you need to build your second brain, just as I did. 

In essence, it's more than just a tool for note-taking. It's an extension of your mind, captured digitally.

