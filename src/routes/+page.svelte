<script lang="ts">
	import { menu } from '#lib/data/menu.ts';

	// Calculate how long the section should be pinned.
	// Section Height = N * 100vh

	// For five items:
	// Outer section = 500vh
	// Inner section = 100vh
	// Available scroll distance = 400vh

	// Create three normal page sections.
	// Make the middle section stay in place while scrolling.
	// Create enough scrolling distance for the interaction.
	// Detect how far the user has scrolled through the middle section.
	// Use that information to change the active item.
	// Use the same information to rotate the disc.
	let section = $state<HTMLElement | undefined>();
	let progress = $state(0);
	let currentDistance = $state(0);
	let totalDistance = $state(1);

	// This gives us the information about the section
	// relative to the viewport.

	// When the section is approaching the viewport, its top
	// position is positive.
	// When it reaches  the top and stayed pinned, the outer section
	// continues moving upward so it becomes negative.

	// Scroll events fire frequently and we don't want to perform unnecessary
	// calculations and interface updates on every event.
	// Instead of scroll we use requestAnimationFrame()
	let frame = $state(0);
	function handleScroll() {
		// Cancels a previously scheduled update if another scroll event arrives first.
		cancelAnimationFrame(frame);

		// Schedules the update
		frame = requestAnimationFrame(() => {
			if (!section) return;

			const rect = section.getBoundingClientRect();

			currentDistance = -rect.top;
			totalDistance = section.offsetHeight - window.innerHeight;

			progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
		});
	}

	$effect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// activeIndex now tells us which image is currently closest to the center.
	const activeIndex = $derived(Math.min(menu.length - 1, Math.round(progress * (menu.length - 1))));

	const IMAGE_SIZE = 320;
	// const IMAGE_GAP = 160;
	const IMAGE_OVERLAP = 80;

	// THe images are closer together and the circular boundaries overlap.
	// We need to change the distance between the starting positions of the images.
	// Instead of adding space between the images, we're allowing them to overlap.
	// We can achieve this with a negative top margin.
	const imageStride = IMAGE_SIZE - IMAGE_OVERLAP;

	// The active image is going to be centered verticaly inside the h[80vh] viewport
	let VIEWPORT_HEIGHT = $state(0);

	// We want to move the image track according to how far the user has scrolled.
	// let imageOffset = $derived(activeIndex * imageStride - centerOffset);
	let imageOffset = $derived(progress * (menu.length - 1) * imageStride);
</script>

<section class="h-dvh bg-[#F4BAA3]"></section>

<!-- Create an area for scrollable distance. -->
<section bind:this={section} class="relative bg-[#F4F0E2]" style={`height: ${menu.length * 100}vh`}>
	<!-- Inner content stays at 100vh while the browser scrolls
    through the outer containter. -->
	<!-- The user sees the same section but the scroll position
     continues advancing.  -->
	<div class="sticky top-0 grid h-screen place-content-center overflow-hidden">
		<!-- Background circle -->
		<div
			class="absolute top-1/2 left-1/2 grid aspect-square w-[min(85vw,900px)] -translate-1/2 place-content-center rounded-full bg-[#F4BAA3]/25"
		></div>
		<!-- Instead of clipping the entire image track into one circle, 
			we're going to clip the track inside a larger rectangular viewport -->

		<!-- Image viewport: controls which part of the vertical image is visible -->
		<!-- Clips anything outside the visible area -->
		<div bind:clientHeight={VIEWPORT_HEIGHT} class="relative z-10 h-[80vh] w-full overflow-hidden">
			<!-- Holds all the images vertically -->
			<!-- Moves all image cards together -->
			<!-- Our first image starts at the top of the viewport, not the center.
				 We want the first image to be centered vertically and every
				 subsequent image to take its place. -->
			<div
				class="flex flex-col items-center gap-40 will-change-transform"
				style={`transform: translate3d(0,calc((80vh - 20rem) / 2 - ${imageOffset}px),0)`}
			>
				<!-- Image cards -->
				{#each menu as item, i (item.title)}
					<div class="size-80 shrink-0 overflow-hidden rounded-full" class:-mt-20={i !== 0}>
						<img
							src={item.image}
							alt={item.title}
							loading="eager"
							decoding="async"
							class="size-full rounded-full object-cover"
							class:opacity-20={activeIndex !== i}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section class="h-dvh bg-[#619DC6]"></section>
