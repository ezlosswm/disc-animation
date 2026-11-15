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

	const activeIndex = $derived(Math.min(menu.length - 1, Math.floor(progress * menu.length)));

	const IMAGESIZE = 320;
	const IMAGEGAP = 160;

	const imageStride = IMAGEGAP + IMAGESIZE;

	// The active image is going to be centered verticaly inside the h[80vh] viewport
	let VIEWPORT_HEIGHT = $state(0);
	const centerOffset = $derived(VIEWPORT_HEIGHT / 2 - IMAGESIZE / 2);
	let imageOffset = $derived(activeIndex * imageStride - centerOffset);
</script>

<section class="h-dvh bg-[#F4BAA3]"></section>

<!-- Create an area for scrollable distance. -->
<section bind:this={section} class="relative bg-[#F4F0E2]" style={`height: ${menu.length * 100}vh`}>
	<!-- Inner content stays at 100vh while the browser scrolls
    through the outer containter. -->
	<!-- The user sees the same section but the scroll position
     continues advancing.  -->
	<h1 class="py-5 text-center text-lg font-semibold">Interactive Section</h1>
	<div class="sticky top-0 grid h-screen place-content-center overflow-hidden">
		<!-- Background circle -->
		<div
			class="absolute top-1/2 left-1/2 grid aspect-square w-[85vw] max-w-212.5 -translate-1/2 place-content-center rounded-full bg-[#F4BAA3]/25"
		>
			<!-- Instead of clipping the entire image track into one circle, 
			we're going to clip the track inside a larger rectangular viewport -->

			<!-- Image viewport: controls which part of the vertical image is visible -->
			<!-- Clips anything outside the visible area -->
			<div
				bind:clientHeight={VIEWPORT_HEIGHT}
				class="relative z-10 h-[80vh] w-full overflow-hidden"
			>
				<!-- Holds all the images vertically -->
				<!-- Moves all image cards together -->
				<div
					class="flex flex-col items-center gap-40 transition-transform duration-700 ease-in-out"
					style={`transform: translateY(-${imageOffset}px)`}
				>
					<!-- Image cards -->
					{#each menu as item, i (item.title)}
						<div class="size-80 shrink-0">
							<img
								src={item.image}
								alt={item.title}
								class="size-full object-cover"
								class:opacity-20={activeIndex !== i}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<section class="h-dvh bg-[#619DC6]"></section>
