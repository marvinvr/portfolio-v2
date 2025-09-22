<script lang="ts">
  import { ExternalLink, ChevronLeft, ChevronRight, X, Expand } from "lucide-svelte";
  import { onMount } from "svelte";

  interface SetupItem {
    name: string;
    detail?: string;
    link?: string;
  }

  interface ShowcaseImage {
    src: string;
    alt?: string;
    productName: string;
    subtitle?: string;
    link?: string;
  }

  interface Props {
    images: ShowcaseImage[];
    product: string;
    description?: string;
    setupTitle?: string;
    items?: SetupItem[];
    reverse?: boolean; // optional: place image on right
    aspectClass?: string; // tailwind aspect ratio classes (square by default)
  }

  let {
    images,
    product,
    description = "",
    setupTitle = "My Setup",
    items = [],
    reverse = false,
    aspectClass = "aspect-square",
  }: Props = $props();

  // Carousel state (Svelte 5 runes for reactivity)
  let currentIndex = $state(0);
  let dominantColor = $state("20, 20, 30"); // Default dark color
  let secondaryColor = $state("40, 40, 60"); // Default secondary
  let modalOpen = $state(false);
  
  const prev = () => {
    const n = images?.length ?? 0;
    if (!n) return;
    currentIndex = (currentIndex - 1 + n) % n;
  };
  const next = () => {
    const n = images?.length ?? 0;
    if (!n) return;
    currentIndex = (currentIndex + 1) % n;
  };

  const openModal = () => {
    modalOpen = true;
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOpen = false;
    document.body.style.overflow = '';
  };

  // Handle keyboard navigation
  const handleKeydown = (e: KeyboardEvent) => {
    if (!modalOpen) return;
    
    switch(e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft':
        prev();
        break;
      case 'ArrowRight':
        next();
        break;
    }
  };

  // Extract dominant colors from image
  async function extractColors(imageSrc: string) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve();
          return;
        }

        // Sample the image at a smaller size for performance
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        
        try {
          const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
          const pixels = imageData.data;
          
          let r = 0, g = 0, b = 0;
          let r2 = 0, g2 = 0, b2 = 0;
          let count = 0;
          let edgeCount = 0;
          
          // Sample colors from the image
          for (let i = 0; i < pixels.length; i += 4) {
            const pixelIndex = i / 4;
            const x = pixelIndex % sampleSize;
            const y = Math.floor(pixelIndex / sampleSize);
            
            // Skip fully transparent pixels
            if (pixels[i + 3] < 128) continue;
            
            // Sample edge pixels for secondary color
            if (x < 5 || x > sampleSize - 5 || y < 5 || y > sampleSize - 5) {
              r2 += pixels[i];
              g2 += pixels[i + 1];
              b2 += pixels[i + 2];
              edgeCount++;
            } else {
              r += pixels[i];
              g += pixels[i + 1];
              b += pixels[i + 2];
              count++;
            }
          }
          
          if (count > 0) {
            // Calculate average colors
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            
            // Darken the colors for better background contrast
            r = Math.round(r * 0.3);
            g = Math.round(g * 0.3);
            b = Math.round(b * 0.35);
            
            dominantColor = `${r}, ${g}, ${b}`;
          }
          
          if (edgeCount > 0) {
            r2 = Math.round(r2 / edgeCount);
            g2 = Math.round(g2 / edgeCount);
            b2 = Math.round(b2 / edgeCount);
            
            // Darken edge colors but keep them slightly brighter
            r2 = Math.round(r2 * 0.4);
            g2 = Math.round(g2 * 0.4);
            b2 = Math.round(b2 * 0.45);
            
            secondaryColor = `${r2}, ${g2}, ${b2}`;
          } else {
            // Fallback to a variation of dominant color
            secondaryColor = `${Math.round(r * 1.5)}, ${Math.round(g * 1.5)}, ${Math.round(b * 1.5)}`;
          }
        } catch (e) {
          // Fallback to default colors if extraction fails
          console.warn('Color extraction failed:', e);
        }
        
        resolve();
      };
      
      img.onerror = () => {
        resolve();
      };
      
      img.src = imageSrc;
    });
  }

  // Extract colors when image changes
  $effect(() => {
    if (images?.[currentIndex]?.src) {
      extractColors(images[currentIndex].src);
    }
  });

  // Extract colors on mount and setup keyboard listener
  onMount(() => {
    if (images?.[0]?.src) {
      extractColors(images[0].src);
    }
    
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  });
</script>

<section class="py-16">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <!-- Mobile: title first, then image, then items -->
    <!-- Desktop: side by side layout controlled by reverse prop -->
    
    <!-- Mobile-only title section -->
    <div class="lg:hidden mb-6">
      <h2 class="text-gray-800 mb-2">{product}</h2>
      {#if description}
        <p class="text-gray-600">{description}</p>
      {/if}
    </div>
    
    <div
      class={`flex items-start gap-8 lg:gap-12 flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
    >
      <!-- Image -->
      <div class="flex-1 w-full">
        {#if images?.length}
          <div class={`relative ${aspectClass} rounded-lg shadow-lg overflow-hidden group`}>
            <!-- Dynamic gradient background based on image colors -->
            <div 
              class="absolute inset-0 transition-all duration-700 ease-in-out"
              style="background: linear-gradient(135deg, rgb({dominantColor}) 0%, rgb({secondaryColor}) 50%, rgb({dominantColor}) 100%)"
            />
            
            <!-- Animated gradient overlay for depth -->
            <div 
              class="absolute inset-0 opacity-50 transition-all duration-700"
              style="background: radial-gradient(circle at 30% 40%, rgba({secondaryColor}, 0.4) 0%, transparent 50%),
                     radial-gradient(circle at 70% 60%, rgba({dominantColor}, 0.3) 0%, transparent 50%),
                     radial-gradient(circle at 50% 50%, rgba({dominantColor}, 0.5) 0%, transparent 70%);"
            />

            <!-- Foreground image (contain, crossfades) -->
            <button 
              class="absolute inset-0 z-[2] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              on:click={openModal}
              aria-label="Open fullscreen view"
            >
              {#each images as img, i (img.src + '-fg')}
                <img
                  src={img.src}
                  loading={i === currentIndex ? 'eager' : 'lazy'}
                  decoding="async"
                  alt={img.alt ?? "Showcase image"}
                  class="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out pointer-events-none"
                  class:opacity-100={i === currentIndex}
                  class:opacity-0={i !== currentIndex}
                  aria-hidden={i !== currentIndex}
                />
              {/each}
              
              <!-- Expand icon overlay -->
              <div class="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Expand class="size-5" />
              </div>
            </button>

            <!-- Soft vignette for edge blending -->
            <div
              class="absolute inset-0 pointer-events-none z-[3]"
              style="background: radial-gradient(ellipse at center, transparent 45%, rgba({dominantColor}, 0.15) 70%, rgba({dominantColor}, 0.35) 85%, rgba({dominantColor}, 0.5) 100%);"
              aria-hidden="true"
            />

            {#if images.length > 1}
              <button
                class="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm z-10 transition-all hover:scale-105"
                type="button"
                aria-label="Previous image"
                on:click={prev}
              >
                <ChevronLeft class="size-5 text-gray-700" />
              </button>
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm z-10 transition-all hover:scale-105"
                type="button"
                aria-label="Next image"
                on:click={next}
              >
                <ChevronRight class="size-5 text-gray-700" />
              </button>
            {/if}

            <!-- Bottom-centered overlay caption -->
            <div class="absolute inset-0 z-10 pointer-events-none flex items-end justify-center p-3" aria-live="polite">
              <div class="pointer-events-auto inline-flex flex-col items-center gap-1 rounded-md bg-black/60 text-white backdrop-blur-md px-3 py-2 shadow-lg">
                <div class="flex items-center gap-2 text-sm font-medium">
                  <span>{images[currentIndex].productName}</span>
                  {#if images[currentIndex].link}
                    <a
                      class="inline-flex items-center text-blue-300 hover:text-white transition-colors"
                      href={images[currentIndex].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open link for ${images[currentIndex].productName}`}
                    >
                      <ExternalLink class="size-4" />
                    </a>
                  {/if}
                </div>
                {#if images[currentIndex].subtitle}
                  <div class="text-xs text-gray-200/90">{images[currentIndex].subtitle}</div>
                {/if}
              </div>
            </div>
          </div>
        {:else}
          <div class="w-full aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200" />
        {/if}
      </div>

      <!-- Text content -->
      <div class="flex-1 w-full">
        <!-- Desktop-only title (hidden on mobile since it's shown above) -->
        <div class="hidden lg:block">
          <h2 class="text-gray-800 mb-2">{product}</h2>
          {#if description}
            <p class="text-gray-600 mb-6">{description}</p>
          {/if}
        </div>

        <div class="lg:mt-2">
          <h3 class="text-gray-800 text-lg font-semibold mb-3">{setupTitle}</h3>

          {#if items.length === 0}
            <p class="text-gray-500 text-sm">No items yet.</p>
          {:else}
            <ul class="space-y-4">
              {#each items as item (item.name)}
                <li class="flex items-start gap-3">
                  <div class="mt-2 h-2 w-2 rounded-full bg-gray-300 shrink-0"></div>
                  <div>
                    <div class="flex items-center gap-2 text-gray-800 font-medium">
                      <span>{item.name}</span>
                      {#if item.link}
                        <a
                          class="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open link for ${item.name}`}
                        >
                          <ExternalLink class="size-4" />
                        </a>
                      {/if}
                    </div>
                    {#if item.detail}
                      <div class="text-gray-600 text-sm">{item.detail}</div>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Fullscreen Modal -->
{#if modalOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
    on:click={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-label="Fullscreen image viewer"
  >
    <!-- Close button -->
    <button
      class="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
      on:click={closeModal}
      aria-label="Close fullscreen view"
    >
      <X class="size-6" />
    </button>

    <!-- Image counter -->
    {#if images.length > 1}
      <div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm z-50">
        {currentIndex + 1} / {images.length}
      </div>
    {/if}

    <!-- Main image container -->
    <div 
      class="relative w-full h-full flex items-center justify-center p-8 md:p-16"
      on:click|stopPropagation
    >
      <!-- Dynamic background gradient -->
      <div 
        class="absolute inset-0 -z-10 transition-all duration-700"
        style="background: radial-gradient(circle at center, rgba({secondaryColor}, 0.2) 0%, rgba({dominantColor}, 0.4) 50%, rgba(0, 0, 0, 0.6) 100%)"
      />

      <!-- Image -->
      <div class="relative max-w-full max-h-full">
        {#each images as img, i (img.src + '-modal')}
          <img
            src={img.src}
            alt={img.alt ?? "Showcase image"}
            class="max-w-full max-h-[80vh] object-contain transition-opacity duration-500 ease-in-out"
            class:opacity-100={i === currentIndex}
            class:opacity-0={i !== currentIndex}
            class:hidden={i !== currentIndex}
          />
        {/each}
      </div>

      <!-- Navigation buttons -->
      {#if images.length > 1}
        <button
          class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-105"
          on:click|stopPropagation={prev}
          aria-label="Previous image"
        >
          <ChevronLeft class="size-6 text-white" />
        </button>
        <button
          class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-105"
          on:click|stopPropagation={next}
          aria-label="Next image"
        >
          <ChevronRight class="size-6 text-white" />
        </button>
      {/if}

      <!-- Bottom caption -->
      <div class="absolute bottom-8 left-1/2 w-full -translate-x-1/2 px-4 sm:w-auto sm:px-0">
        <div
          class="mx-auto flex w-full flex-col items-center gap-1 rounded-lg bg-black/70 text-white backdrop-blur-md px-4 py-3 text-center shadow-xl sm:inline-flex sm:w-auto"
        >
          <div class="flex items-center gap-2 text-base font-medium">
            <span>{images[currentIndex].productName}</span>
            {#if images[currentIndex].link}
              <a
                class="inline-flex items-center text-blue-300 hover:text-white transition-colors"
                href={images[currentIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                on:click|stopPropagation
                aria-label={`Open link for ${images[currentIndex].productName}`}
              >
                <ExternalLink class="size-4" />
              </a>
            {/if}
          </div>
          {#if images[currentIndex].subtitle}
            <div class="text-sm text-gray-200/90">{images[currentIndex].subtitle}</div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}