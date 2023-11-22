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

In this digital era, flooded with information and continuous learning opportunities, managing and organizing knowledge has never been more paramount. As a data science student and an avid learner, I've wandered through various applications and systems searching for the perfect tool to capture, store, and make sense of everything I learn. That quest only came to a halt when I learned about Obsidian – a powerful note-taking app that has revolutionized the way I organize my thoughts, ideas, and academic material. 

Obsidian stands out in the sea of note-taking applications with its unique combination of simplicity, flexibility, and power. For me, it functions as not just a tool for documentation but as an extension of my cognitive processes – a 'Second Brain' if you will. In this post, I'm excited to share how I've leveraged Obsidian to elevate my note-taking to an art form and how it has made a significant impact on my university life. From its markdown-centric approach to its customizable plugin ecosystem, my journey with Obsidian has reshaped my approach to learning and productivity. Join me as I delve into the features and personal experiences that make Obsidian indispensable for anyone looking to take their knowledge management to the next level.

## What is Obsidian?
![Obsidian]({obsidian})

Before diving into the mechanics of how Obsidian transforms chaotic data into an organized structure, it's essential to understand what Obsidian is at its core. Obsidian is a remarkable note-taking and knowledge management app that allows users to write, edit, and organize their notes using a sleek interface. It is based on the principle of a knowledge base or digital garden that grows and evolves with you.

The magic of Obsidian lies in its use of plain text markdown files to create and manage notes. Unlike other proprietary formats that lock you into a certain platform, markdown files are portable, future-proof, and can be read by a multitude of editors and applications. This feature ensures that your data remains accessible and editable outside of Obsidian, giving you the freedom to control and manage your knowledge as you see fit.

But Obsidian isn’t just a simple markdown editor—it's a hub that connects your thoughts through links, much like the intertwined web of neurons in the human brain. You can link notes together, create intricate networks of ideas, and visualize the connections through various graph views. This interconnected system not only makes it easier to find relationships between disparate pieces of information but also fosters a deeper understanding and retention of knowledge.

Furthermore, Obsidian is designed to be as unassuming or as complex as you need it to be. With its customizable nature, it serves equally well for users seeking a lightweight, distraction-free writing environment, as it does for power users who revel in tailoring the application to their specific workflow with the help of its robust plugin ecosystem. 

At its heart, Obsidian champions user agency and data ownership. You can store your knowledge vault wherever you prefer—locally on your device or on your chosen cloud service. This ensures complete control over the safety and privacy of your data. 

Whether you're making quick notes, archiving insights from a research paper, or piecing together a complex concept, Obsidian provides a rich soil in which the seeds of your knowledge can be sown and nurtured into a vibrant intellectual garden that is uniquely yours.

## The Core Advantage: Markdown Format
One of the core advantages of Obsidian lies in its use of Markdown for note creation and editing. Markdown is a lightweight markup language with plain text formatting syntax that is designed to be converted to HTML and other formats using simple, readable symbols. This feature is what sets Obsidian apart from many other note-taking apps and offers several significant benefits.

Markdown is incredibly user-friendly and easy to pick up, even for those who are not tech-savvy. If you can type, you can use Markdown. This simplicity allows for rapid note-taking without the cumbersome overhead of navigating complex formatting menus and options, which can interrupt the flow of thought during brainstorming sessions or lectures.

![Markdown]({markdown})

In addition to that, they files are extraordinarily flexible. Unlike proprietary formats used by many note-taking apps, Markdown files are future-proof and portable. You can open, edit, and manage them with a wide array of text editors and software, ensuring your notes remain accessible no matter how your digital tools change. This plays into the philosophy of long-term knowledge retention and management, freeing Obsidian users from the worry of software obsolescence or vendor lock-in. And therefore gives it a huge advantage over other note-taking tools like Notion.

When coupled with Obsidian's linking and graphing capabilities, Markdown becomes even more powerful. You can effortlessly create links within your text that bridge concepts and notes, building a web of information that visually and contextually represents the neural networks of your own thinking.

![Obsidian Interface]({obsidianInterface})

Another incredible aspect, especially for Software Engineers, is the way Markdown pairs with version control systems, such as Git. This combination allows you to track changes over time, collaborate with others, and even roll back to previous versions of your notes if needed, all while maintaining a clear and readable format.

## Navigating University with Obsidian
Attending university involves managing a vast array of information spanning different subjects, projects, and research materials. For students, ensuring this information is organized and easily retrievable can be as crucial as understanding the content itself. Here is where Obsidian has become an academic ally for me.

![Obsidian Graph]({obsidianGraph})

The first aspect of Obsidian that aids in navigating university life is its non-linear note-taking capability. With the ability to interlink notes, I can relate concepts from different lectures or research materials, regardless of their chronological order. This method reflects the actual structure of knowledge, where ideas are interconnected rather than isolated. By building a network of notes, I create a personalized encyclopedia of my university courses that becomes more valuable over time.

One of the most impactful features of Obsidian for students is its ability to handle different media types. I can integrate images from slides, embed PDFs, and even link audio recordings right within my notes. When it comes to revising or digging deeper into a topic, having all these resources available in one place saves me considerable time and aggravation. Obsidian also has plugins available to more directly work with different formats. For example, the [Omnisearch Plugin](https://github.com/scambier/obsidian-omnisearch) allows for PDF files to be indexed using Optical Character Recognition and searched through as if they were text files, allowing me to find anything I'm looking for.

![Obsidian LaTeX]({obsidianLatex})


Additionally, Obsidian’s ability to support LaTeX within notes is invaluable for courses heavy on equations and mathematical formulations. As a data science student, being able to notate complex formulas and have them rendered beautifully within my notes streamlines my study process and aids in comprehension.

The result is a robust, searchable, and incredibly personalized database of knowledge, which evolves concurrently with my academic journey. Needless to say, Obsidian has not just been a tool for taking notes but a companion throughout my learning experience at the university, enabling me to capture the breadth of my education in a structured, yet flexible manner.

## Leveraging the Plugin Ecosystem
The true power of Obsidian as a second brain lies not only in its markdown capabilities or linking features but also in its extensive plugin ecosystem. With a community that's always growing and innovating, Obsidian offers plugins that cater to the unique workflow of each user. This means you have the flexibility to customize your experience to suit your specific needs, whether you're a student, researcher, writer, or anyone in between.

Plugins for Obsidian come in all shapes and sizes, fulfilling a wide array of functions designed to streamline your note-taking and information management. From simple quality-of-life improvements like better text formatting to advanced functionality like automated task management, the plugin ecosystem turns the already versatile Obsidian into a powerhouse of productivity.

In the following sections, I will delve deeper into two specific plugins, the Projects Plugin and the Text Generator Plugin, which have been particularly instrumental in enhancing my productivity and efficiency in managing university work and personal learning endeavors within Obsidian.

### Projects Plugin
![Projects Plugin]({obsidianProjectsPlugin})

The Projects Plugin in Obsidian is an incredible tool for people like me, needing to manage a multitude of tasks and projects. At its core, this plugin leverages the versatility of Markdown to create dynamic, flexible data tables that seamlessly integrate into your existing notes structure.

By utilizing markdown metadata fields, the plugin allows you to store detailed project information such as titles, statuses, deadlines, and more, right within your note's metadata. What's ingenious about this approach is the information remains within your markdown files, ensuring that your data is stored in a text-based, portable, and software-agnostic format, adhering to the very principles that make Obsidian so powerful.

![Projects Plugin Kanban]({obsidianProjectsPluginKanban})

Once your project data is in place, the Projects Plugin provides several intuitive views to visualize and interact with your projects. If you're inclined towards a traditional, spreadsheet-like overview, you can opt for the table view. For those who appreciate the clarity brought by visual segmentation, the kanban board view turns your projects into movable cards across different columns, ideal for tracking progress in stages. And for the schedule-oriented, the calendar view offers a time-based perspective, making it convenient to keep track of upcoming deadlines and milestones.

What sets the Projects Plugin apart is the way it harmonizes with Obsidian's existing interface. The transition between your notes and your projects is seamless, with links and backlinks maintaining the intricate web of connections within your digital library. The ability to have a bird's-eye view of all your projects while being able to drill down into granular details simply by clicking through to the related notes transforms Obsidian from a mere note-taking app to a potent project management tool. 

For a university student juggling multiple courses, assignments, and personal projects, this functionality is invaluable. Not only can I maintain oversight on my academic obligations and deadlines, but I can also track the progress of research projects, extracurricular activities, or any other endeavor I undertake. The Projects Plugin ensures that no detail is lost in the shuffle of a hectic academic schedule, and that I can stay organized and ahead of my workload with confidence.

### Text Generator Plugin
![Text Generator Plugin]({obsidianTextGeneratorPlugin})
*Website*: [Text Generator Plugin](https://text-gen.com/)

The Text Generator Plugin for Obsidian introduces a profound leap in efficiency when it comes to note-taking and information documentation. By integrating OpenAI's language models directly into my workflow, I can invoke AI-powered text completion with a simple hotkey. The ability to pick up from where I left off in a sentence and generate contextually relevant content is a game-changer, especially when it comes to crafting expansive notes with boilerplate information, like standard definitions and introductory explanations, that, while necessary, can be tedious to write out.

What makes this plugin exceptionally useful is its customizability. I can define the specifics of how it behaves, like the hotkey trigger and the version of the language model being used, tailoring the tool to my personal writing style and note-taking needs. The Text Generator can be particularly helpful in bridging the gap between ideas, providing me with a starting point for elaboration and further exploration of a topic, which I can then refine and expand upon with my insights and knowledge.

However, with the power of AI-generated text comes the responsibility of scrutiny. While the language models can produce remarkably coherent and relevant content, they are not infallible sources of truth. The information generated must be fact-checked and verified. This is a critical step in the process, as incorporating incorrect or misleading information into my notes and therefore study process will lead to confusion or inaccuracies in my understanding and documentation.

Despite this necessary step of fact-checking, the Text Generator Plugin is an invaluable asset, allowing me to focus my cognitive efforts on learning and synthesizing information rather than getting bogged down in the minutiae of repetitive writing tasks.

## Public Knowledge Base: A Tour of My Obsidian Library
![My Obsidian Valut]({myObsidianVault})

Delving into my public Obsidian library offers a glimpse into the essence of what I've learned and continue to explore. Located at [docs.marvinvr.ai](https://docs.marvinvr.ai), you can navigate through a well-organized repository of knowledge that showcases the true collaborative and evolutionary nature of learning.

My Obsidian setup mirrors the multi-faceted interests and demands of my academic career. It constitutes a series of main categories, some of which are elaborated into further subcategories.

My primary Obsidian "Vault" is called "Documentation".  Here, you will find a mix of notes on `Code`, `Deep Learning`, `Natural Language Processing`, `Hardware`, and `Maths`. Each of these broad categories is broken down into more specialized subtopics. For instance, under 'Deep Learning', you can delve into notes covering everything from 'Activation Functions' to `Models`, which are the building blocks of this complex field.

'Hardware' is where my tinkering takes a physical form, with sections dedicated to `OPNSense`, `Raspberry Pi`, `Ubuntu Server`, and `Unraid`. These notes serve as technical guides and references based on my personal setup experiences.

*Note:* Parts of my library, specifically the math parts, are written in German, this is due to my education taking place in Switzerland.

The documentation housed in my public Obsidian library serves not just as a personal reference but also as an educational resource for others, inviting collaboration, discussion, and collective advancement. It is dynamic, growing with each semester. Obsidian opens the opportunity for me to openly share what I have learned and let others join in.

## Conclusion
In the realm of digital note-taking and knowledge management, Obsidian stands out as a versatile and robust tool that caters to the needs of students, researchers, and lifelong learners alike. Its markdown-centric approach not only ensures a future-proofed and accessible database of information but also synergizes well with an incredibly adaptable plugin ecosystem that can be personalized for any user's workflow.

For me, the process of integrating Obsidian into my university life has been revolutionary. It has enabled a fluid transfer of knowledge into a centralized and interlinked hub, where my thoughts, study materials, and project management coexist in harmony. With the help of outstanding plugins like Projects and Text Generator, I'm able to tackle complex academic challenges with systematic efficiency.

Embracing Obsidian is a step towards building a second brain, a digital counterpart that supplements our natural memory and augments our intellectual pursuits. My public Obsidian library is an extension of my commitment to open knowledge and collaborative growth, and I will continue to do so in the future.

