<script lang="ts">
	const items = ['wings', 'fries', 'burgers', 'dip', 'nachos'];

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
	let currentDistance = $state(0);
	let totalDistance = $state(1);

	// This gives us the information about the section
	// relative to the viewport.

	// When the section is approaching the viewport, its top
	// position is positive.
	// When it reaches  the top and stayed pinned, the outer section
	// continues moving upward so it becomes negative.
	// function updateScroll() {
	// 	if (!section) return;

	// 	const rect = section.getBoundingClientRect();

	// 	currentDistance = -rect.top;
	// 	totalDistance = section.offsetHeight - window.innerHeight;

	// 	console.log('User is scrolling.', progress);
	// }

	// $effect(() => {
	// 	window.addEventListener('scroll', updateScroll, { passive: true });
	// 	window.addEventListener('resize', updateScroll);

	// 	updateScroll();

	// 	return () => {
	// 		window.removeEventListener('scroll', updateScroll);
	// 		window.removeEventListener('resize', updateScroll);
	// 	};
	// });

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
		});
	}

	$effect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Calculate the progress but constrain it between zero and one.
	// This is the most important concept in the interaction.
	// We ask JS where the user currently is - this makes the animation reversible
	// and synced with the scrollbar.
	const progress = $derived(Math.max(0, Math.min(1, currentDistance / totalDistance)));

	// Determine which item is active.
	const activeIndex = $derived(Math.min(items.length - 1, Math.floor(progress * items.length)));

	// Make the disc rotate by multiplying the progress variable
	// with the number of degrees we want the disc to rotate.
	const DEGREES = 270;
	const rotation = $derived(progress * DEGREES);
</script>

<section class="h-dvh bg-[#F4BAA3]"></section>

<!-- Create an area for scrollable distance. -->
<section bind:this={section} class="relative h-[500vh] bg-[#F4F0E2]">
	<!-- Inner content stays at 100vh while the browser scrolls
    through the outer containter. -->
	<!-- The user sees the same section but the scroll position
     continues advancing.  -->
	<div class="sticky top-0 h-screen overflow-hidden">
		<h1 class="text-lg font-semibold">Interactive Section</h1>

		<h2 class="my-5">{items[activeIndex]}</h2>
		{#each items as item, i (item)}
			<div
				class="px-8 transition-all duration-500 ease-in-out"
				class:opacity-100={activeIndex === i}
				class:opacity-20={activeIndex !== i}
				class:translate-x-0={activeIndex !== i}
				class:translate-x-8={activeIndex === i}
			>
				{@render disc(item)}
			</div>
		{/each}
	</div>
</section>

<section class="h-dvh bg-[#619DC6]"></section>

{#snippet disc(item: string)}
	<div
		class="grid size-40 place-content-center rounded-3xl bg-[#619DC6]"
		style={`transform: rotate(${rotation}deg)`}
	>
		{item}
	</div>
{/snippet}
