<script lang="ts">
	type Props = {
		title?: string;
		startTime?: string;
		endTime?: string;
		ongoing?: boolean;
	};

	let { title, startTime = '10:00 AM', endTime = '11:00 AM', ongoing = true }: Props = $props();

	import { onMount, tick, onDestroy } from 'svelte';
	let titleRef = $state<HTMLParagraphElement | null>(null);
	let isOverflowing = $state(false);

	const checkOverflow = (el: HTMLElement | null) => {
		if (!el) return false;

		// Get the parent container width
		const container = el.parentElement;
		if (!container) return false;

		// Create a temporary element to measure the text width
		const temp = document.createElement('span');
		temp.style.visibility = 'hidden';
		temp.style.position = 'absolute';
		temp.style.whiteSpace = 'nowrap';
		temp.style.fontSize = window.getComputedStyle(el).fontSize;
		temp.style.fontFamily = window.getComputedStyle(el).fontFamily;
		temp.style.fontWeight = window.getComputedStyle(el).fontWeight;
		temp.textContent = el.textContent;

		document.body.appendChild(temp);
		const textWidth = temp.offsetWidth;
		document.body.removeChild(temp);

		// Check if text width is greater than container width
		return textWidth > container.clientWidth;
	};
	const updateOverflow = async () => {
		await tick();
		isOverflowing = checkOverflow(titleRef);
	};

	onMount(() => {
		updateOverflow();
		window.addEventListener('resize', updateOverflow);
		return () => {
			window.removeEventListener('resize', updateOverflow);
		};
	});
</script>

{#if ongoing}
	<li class="media-object glass-card-ongoing rounded-xl shadow-lg">
		<div class="flex items-center">
			<div class="min-w-0 flex-1 px-2 py-1">
				<div class=" flex items-center justify-between">
					<p class="text-3xl font-medium tracking-wide text-emerald-900 drop-shadow-sm">
						{startTime} - {endTime}
					</p>
					<span
						class="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white shadow-lg"
					>
						<div class="mr-2 h-2 w-2 animate-pulse rounded-full bg-white"></div>
						Ongoing
					</span>
				</div>
				<div
					class={`relative whitespace-nowrap${isOverflowing ? ' text-fade-container-overflowing overflow-hidden' : ''}`}
				>
					<p
						bind:this={titleRef}
						class={`inline-block text-4xl font-semibold text-emerald-900${isOverflowing ? ' animate-marquee' : ''}`}
					>
						{title}
					</p>
				</div>
			</div>
		</div>
	</li>
{:else}
	<li
		class="relative flex flex-col rounded-xl border border-white/30 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg"
	>
		<div class="flex items-center">
			<div class="mb-1 min-w-0 flex-1 px-2 py-1">
				<div class=" flex items-center">
					<p class="text-3xl font-medium tracking-wide text-slate-700 drop-shadow-sm">
						{startTime} - {endTime}
					</p>
				</div>
				<div
					class={`relative whitespace-nowrap${isOverflowing ? ' text-fade-container-overflowing overflow-hidden' : ''}`}
				>
					<p
						bind:this={titleRef}
						class={`inline-block text-4xl font-semibold text-slate-800${isOverflowing ? ' animate-marquee' : ''}`}
					>
						{title}
					</p>
				</div>
			</div>
		</div>
	</li>
{/if}

<style>
	.glass-card-ongoing {
		background: linear-gradient(135deg, rgba(236, 253, 245, 0.9), rgba(209, 250, 229, 0.8));
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 2px solid rgba(16, 185, 129, 0.3);
		box-shadow:
			0 12px 40px rgba(16, 185, 129, 0.15),
			0 6px 20px rgba(16, 185, 129, 0.1),
			inset 0 2px 0 rgba(255, 255, 255, 0.5),
			inset 0 -1px 0 rgba(16, 185, 129, 0.1);
	}

	.glass-card {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.08),
			0 6px 20px rgba(0, 0, 0, 0.04),
			inset 0 2px 0 rgba(255, 255, 255, 0.4),
			inset 0 -1px 0 rgba(0, 0, 0, 0.05);
	}

	@keyframes marquee {
		0% {
			transform: translateX(0%);
		}
		15% {
			transform: translateX(0%);
		}
		35% {
			transform: translateX(-25%);
		}
		60% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(-100%);
		}
	}

	.animate-marquee {
		display: inline-block;
		animation: marquee 40s linear infinite;
	}

	.text-fade-container-overflowing {
		-webkit-mask: linear-gradient(to right, black 0%, black calc(100% - 50px), transparent 100%);
		mask: linear-gradient(to right, black 0%, black calc(100% - 50px), transparent 100%);
	}

	.text-fade-container-bottom {
		-webkit-mask: linear-gradient(to bottom, black 0%, black calc(100% - 10px), transparent 100%);
		mask: linear-gradient(to bottom, black 0%, black calc(100% - 10px), transparent 100%);
	}

	.media-object {
		--border-width: 1px;
		--radius: 12px;

		position: relative;
		border-radius: var(--radius);
		border: var(--border-width) solid transparent;
	}

	.media-object::before {
		content: ' ';
		position: absolute;
		inset: calc(var(--border-width) * -1);
		z-index: -1;
		border: inherit;
		border-radius: inherit;
		background-image: conic-gradient(
			from var(--angle),
			#e0fce6 80%,
			#1fd64d 88%,
			#1fd64d 92%,
			#e0fce6 100%
		);
		background-origin: border-box;
		-webkit-mask:
			linear-gradient(black, black) content-box,
			linear-gradient(black, black);
		mask: linear-gradient(black, black), linear-gradient(black, black);
		-webkit-mask-clip: content-box, border-box;
		mask-clip: content-box, border-box;
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: spin 5s linear infinite;
	}

	@supports not (background: paint(something)) {
		.media-object::before {
			background-image: conic-gradient(#e0fce6 80%, #57f0bf 88%, #8ae4c7 92%, #e0fce6 100%);
		}
	}

	@property --angle {
		syntax: '<angle>';
		inherits: true;
		initial-value: 0turn;
	}

	@keyframes spin {
		to {
			--angle: 1turn;
		}
	}
</style>
