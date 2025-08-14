<script lang="ts">
	type Props = {
		title?: string;
		startTime?: string;
		endTime?: string;
		ongoing?: boolean;
	};

	let { title, startTime = '10:00 AM', endTime = '11:00 AM', ongoing = true }: Props = $props();

	// Create an array of 4 elements for iteration
	const items = Array.from({ length: 3 });
</script>

<ul class="space-y-4">
	{#if ongoing}
		<li class="media-object glass-card-ongoing">
			<div class="flex items-center">
				<div class="min-w-0 flex-1 p-4">
					<div class="mb-2 flex items-center justify-between space-x-4">
						<p class="text-lg font-semibold text-black drop-shadow-sm">
							{startTime} - {endTime}
						</p>
						<p class="text-md text-emerald-700">Ongoing</p>
					</div>
					<div class="text-fade-container relative overflow-hidden whitespace-nowrap">
						<p class="animate-marquee inline-block text-2xl font-semibold text-black">
							{title} this is very long and complecated meetings title - what should i do to display
							whole but to not take to much space&nbsp
						</p>
					</div>
				</div>
			</div>
		</li>
	{/if}
	{#each items as _, i}
		<li class="glass-card relative flex flex-col rounded-xl">
			<div class="flex items-center">
				<div class="min-w-0 flex-1 p-4">
					<div class="mb-2 flex items-center space-x-4">
						<p class="text-lg font-semibold text-gray-700 drop-shadow-sm">
							{startTime} - {endTime}
						</p>
					</div>
					<div class="text-fade-container relative overflow-hidden whitespace-nowrap">
						<p class="inline-block text-2xl font-semibold text-gray-800">
							{title}
						</p>
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.glass-card-ongoing {
		background: rgb(224, 252, 230);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 2px solid rgba(255, 255, 255, 0.2);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.1),
			0 4px 16px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.1),
			0 4px 16px rgba(0, 0, 0, 0.05),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
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

	.text-fade-container {
		-webkit-mask: linear-gradient(to right, black 0%, black calc(100% - 40px), transparent 100%);
		mask: linear-gradient(to right, black 0%, black calc(100% - 40px), transparent 100%);
	}

	.media-object {
		--border-width: 3px;
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
