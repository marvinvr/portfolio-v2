<script lang="ts">
    import LanguagePython from "svelte-material-icons/LanguagePython.svelte";
    import LanguageTypescript from "svelte-material-icons/LanguageTypescript.svelte";
    import LanguageJava from "svelte-material-icons/LanguageJava.svelte";
    import LanguageGo from "svelte-material-icons/LanguageGo.svelte";
    import Database from "svelte-material-icons/Database.svelte";
    import Robot from "svelte-material-icons/Robot.svelte";
    import ChartBellCurve from "svelte-material-icons/ChartBellCurve.svelte";
    import Docker from "svelte-material-icons/Docker.svelte";
    import type { Component } from "svelte";
    import SectionHeader from "./SectionHeader.svelte";

    const iconMap: Record<string, Component> = {
        python: LanguagePython,
        typescript: LanguageTypescript,
        java: LanguageJava,
        go: LanguageGo,
        database: Database,
        robot: Robot,
        ml: ChartBellCurve,
        docker: Docker,
    };

    interface TechItem {
        name: string;
        icon: string;
        related: string[];
        experience: string;
        description: string;
    }

    interface Props {
        title: string;
        description: string;
        techStack: TechItem[];
    }

    let { title, description, techStack }: Props = $props();
</script>

<section class="py-24" id="tech-stack">
    <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <SectionHeader {title} {description} />

        <div class="relative mt-12">
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {#each techStack as tech}
                    {@const IconComponent = iconMap[tech.icon]}
                    <div
                        class="bg-white flex flex-col h-full p-4 border border-gray-200 rounded-md"
                    >
                        <div class="text-sky-700 pb-1">
                            <IconComponent class="w-6 h-6" />
                        </div>
                        <div class="flex items-baseline justify-between mb-3">
                            <span class="text-lg text-gray-800 font-semibold">
                                {tech.name}
                            </span>
                            <span class="text-xs text-sky-700">
                                {tech.experience}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600">
                            {tech.description}
                        </p>
                        <div class="flex flex-wrap gap-1.5 pt-3 mt-auto">
                            {#each tech.related as item}
                                <span
                                    class="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-sm"
                                >
                                    {item}
                                </span>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>
