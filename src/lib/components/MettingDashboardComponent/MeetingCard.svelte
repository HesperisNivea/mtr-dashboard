<script lang="ts">
	type Props = {
		duration?: number; // Duration in minutes
		size?: 'small' | 'medium' | 'large';
		title?: string;
		startTime?: string;
		endTime?: string;
		ongoing?: boolean;
	};

	let { size = 'medium', title, startTime = '10:00 AM', endTime = '11:00 AM', duration, ongoing = true }: Props = $props();

	// Create an array of 12 elements for iteration
	const items = Array.from({ length: 4 });
</script>

<ul class="space-y-4">
	{#if ongoing}
		<li class="glass-card-ongoing flex flex-col rounded-xl relative">
			<div class="flex items-center">
				<div class="flex-1 p-4 min-w-0">
					<div class="flex items-center space-x-4 mb-2">
						<p class="font-semibold text-lg text-neutral-800 drop-shadow-sm">{startTime} - {endTime}</p>
					</div>
					<div class="overflow-hidden whitespace-nowrap relative text-fade-container">
						<p class="inline-block animate-marquee text-2xl font-semibold text-neutral-700">
							{title} this is very long and complecated meetings title - what should i do to display whole but to not take to much space&nbsp
						</p>
					</div>
				</div>
				<div class="flex items-center pe-4 flex-shrink-0">
					<div class="ongoing-sticker">
						<p class="text-xs text-neutral-800 font-medium">Ongoing</p>
					</div>
				</div>
			</div>
		</li>
	{/if}
	{#each items as _, i}
		<li class="glass-card flex flex-col rounded-xl relative">
			<div class="flex items-center">
				<div class="flex-1 p-4 min-w-0">
					<div class="flex items-center space-x-4 mb-2">
						<p class="font-semibold text-lg text-gray-700 drop-shadow-sm">{startTime} - {endTime}</p>
					</div>
					<div class="overflow-hidden whitespace-nowrap relative text-fade-container">
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

	.glass-card, .glass-card-ongoing {
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

	.ongoing-sticker {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 2px solid rgba(5, 150, 105, 0.5);
		border-radius: 50%;
		box-shadow: 
			0 12px 32px rgba(5, 150, 105, 0.3),
			0 6px 16px rgba(5, 150, 105, 0.25),
			inset 0 2px 4px rgba(255, 255, 255, 0.4),
			inset 0 -2px 4px rgba(5, 150, 105, 0.25);
	}
	.ongoing-sticker p {
		position: relative;
		z-index: 1;
		color: #064e3b;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
		font-weight: 600;
		letter-spacing: 0.025em;
	}

	.status-indicator {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
	}

	.status-indicator.upcoming {
		border: 2px solid rgba(107, 114, 128, 0.4);
		box-shadow: 
			0 8px 20px rgba(107, 114, 128, 0.15),
			0 4px 10px rgba(107, 114, 128, 0.1),
			inset 0 2px 4px rgba(255, 255, 255, 0.3),
			inset 0 -2px 4px rgba(107, 114, 128, 0.1);
	}

	.status-indicator p {
		position: relative;
		z-index: 1;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
		font-weight: 600;
		letter-spacing: 0.025em;
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
    -webkit-mask: linear-gradient(
      to right,
      black 0%,
      black calc(100% - 40px),
      transparent 100%
    );
    mask: linear-gradient(
      to right,
      black 0%,
      black calc(100% - 40px),
      transparent 100%
    );
  }
</style>
