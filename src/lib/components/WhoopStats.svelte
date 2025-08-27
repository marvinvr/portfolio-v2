<script lang="ts">
  import { onMount } from 'svelte';
  import Heart from "svelte-material-icons/Heart.svelte";
  import Sleep from "svelte-material-icons/Sleep.svelte";
  import ChartLine from "svelte-material-icons/ChartLine.svelte";
  import Pulse from "svelte-material-icons/Pulse.svelte";
  import BedOutline from "svelte-material-icons/BedOutline.svelte";
  import Speedometer from "svelte-material-icons/Speedometer.svelte";
  import InformationOutline from "svelte-material-icons/InformationOutline.svelte";

  interface WhoopStats {
    recovery: { latest: number; monthly: number; annual?: number };
    strain: { latest: number; monthly: number; annual?: number };
    hrv: { latest: number; monthly: number; annual?: number };
    rhr: { latest: number; monthly: number; annual?: number };
    sleepEfficiency: { latest: number; monthly: number; annual?: number };
    sleepDuration: { latest: number; monthly: number; annual?: number };
    lastUpdated: string;
  }

  let stats: WhoopStats | null = $state(null);
  let loading = $state(true);
  let error: string | null = $state(null);

  const statConfig = [
    {
      key: 'recovery',
      title: 'Recovery Score',
      icon: Heart,
      unit: '%',
      description: 'Overall readiness for strain',
      tooltip: 'Recovery measures how ready your body is for strain. It\'s based on your HRV, resting heart rate, sleep performance, and respiratory rate. Higher scores (green: 67-100%) mean you\'re well-recovered and ready for high intensity.'
    },
    {
      key: 'strain',
      title: 'Strain Score',
      icon: Speedometer,
      unit: '',
      description: 'Cardiovascular load',
      tooltip: 'Strain quantifies the cardiovascular load you\'ve accumulated throughout the day. It\'s measured on a 0-21 scale based on your heart rate. Higher strain means more cardiovascular stress and adaptation.'
    },
    {
      key: 'hrv',
      title: 'HRV',
      icon: Pulse,
      unit: 'ms',
      description: 'Heart rate variability',
      tooltip: 'Heart Rate Variability measures the variation in time between heartbeats. Higher HRV indicates better recovery and resilience to stress. It\'s one of the best markers for overall health and fitness.'
    },
    {
      key: 'rhr',
      title: 'Resting HR',
      icon: ChartLine,
      unit: 'bpm',
      description: 'Resting heart rate',
      tooltip: 'Resting Heart Rate is your heart rate during deep sleep. Lower RHR typically indicates better cardiovascular fitness. Changes in RHR can signal stress, illness, or overtraining.'
    },
    {
      key: 'sleepEfficiency',
      title: 'Sleep Efficiency',
      icon: Sleep,
      unit: '%',
      description: 'Sleep quality percentage',
      tooltip: 'Sleep Efficiency measures the percentage of time in bed spent actually sleeping (vs being awake). Higher efficiency (85%+) indicates better sleep quality with fewer disturbances.'
    },
    {
      key: 'sleepDuration',
      title: 'Sleep Duration',
      icon: BedOutline,
      unit: 'h',
      description: 'Average sleep time',
      tooltip: 'Total time spent in light, REM, and deep sleep stages. Does not include time awake in bed. Most adults need 7-9 hours for optimal recovery and performance.'
    }
  ];

  onMount(async () => {
    try {
      const response = await fetch('/api/whoop/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }
      stats = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load Whoop stats';
    } finally {
      loading = false;
    }
  });

  function formatValue(value: number, unit: string): string {
    if (unit === 'h') {
      return `${value.toFixed(1)}${unit}`;
    }
    return `${Math.round(value)}${unit}`;
  }
</script>

<section class="py-24" id="whoop-stats">
  <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
    <div class="relative max-w-2xl">
      <div class="relative z-10">
        <h2 class="text-gray-800">🏃‍♂️ My Stats</h2>
        <p class="mt-3">
          I track my health and activity using a <a href="https://www.whoop.com" class="text-indigo-600 hover:text-indigo-700 underline">Whoop 5.0</a> device. 
          These numbers reflect my daily activity and recovery as well as my heart health metrics averaged over monthly and annual periods. I'm sharing this to keep myself accountable and because I thought this would be cool. 🤓
        </p>
      </div>
    </div>
    
    {#if loading}
      <div class="relative mt-12">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {#each Array(6) as _}
            <div class="bg-white space-y-3 p-4 border rounded-lg animate-pulse">
              <div class="w-6 h-6 bg-gray-200 rounded"></div>
              <div class="w-32 h-6 bg-gray-200 rounded"></div>
              <div class="w-16 h-8 bg-gray-200 rounded"></div>
              <div class="space-y-2">
                <div class="w-24 h-4 bg-gray-200 rounded"></div>
                <div class="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if error}
      <div class="relative mt-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-600 font-medium">Unable to load Whoop stats</p>
          <p class="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    {:else if stats}
      <div class="relative mt-12">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {#each statConfig as config}
            {@const statData = stats[config.key]}
            <div class="bg-white space-y-3 p-4 border rounded-lg hover:shadow-lg transition-shadow relative">
              <div class="flex justify-between items-start">
                <div class="text-indigo-600 pb-3">
                  <config.icon class="w-6 h-6" />
                </div>
                <div class="group relative">
                  <InformationOutline class="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  <div class="invisible group-hover:visible absolute right-0 top-6 z-10 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="absolute -top-1 right-2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    {config.tooltip}
                  </div>
                </div>
              </div>
              <span class="text-lg text-gray-800 font-semibold">
                {config.title}
              </span>
              <div class="text-2xl font-bold text-gray-900">
                {formatValue(statData.latest, config.unit)}
              </div>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>30-day avg:</span>
                  <span class="font-medium">{formatValue(statData.monthly, config.unit)}</span>
                </div>
                {#if statData.annual !== undefined}
                  <div class="flex justify-between">
                    <span>Annual avg:</span>
                    <span class="font-medium">{formatValue(statData.annual, config.unit)}</span>
                  </div>
                {/if}
              </div>
              <p class="text-xs text-gray-500 mt-2">
                {config.description}
              </p>
            </div>
          {/each}
        </div>
        <div class="text-center mt-8">
          <p class="text-xs text-gray-400">
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    {/if}
  </div>
</section>