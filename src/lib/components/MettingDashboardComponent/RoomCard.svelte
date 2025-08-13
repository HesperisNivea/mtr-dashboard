<script lang="ts">
	import MeetingCard from './MeetingCard.svelte';

	type Props = {
		roomName?: string;
		numberOfMeetings?: number;
	};

	let { roomName = 'Meeting Room', numberOfMeetings = 0 }: Props = $props();
</script>

<div class="container">
	<div class="glass-card relative space-y-4 rounded-xl bg-blue-100 px-3 py-6">
		<div class="text-center">
			<h3 class="text-2xl font-bold text-gray-800 drop-shadow-sm">{roomName}</h3>
			<p class="text-sm font-medium text-gray-600">{numberOfMeetings} meetings scheduled</p>
		</div>

		{#if numberOfMeetings > 0}
			<div class="relative z-10">
				<MeetingCard title="Meeting"></MeetingCard>
			</div>
		{:else}
			<div class="glass-empty flex flex-col items-center justify-center rounded-lg p-6">
				<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300/50">
					<svg class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<p class="text-center font-medium text-gray-600">No meetings scheduled</p>
				<p class="mt-1 text-xs text-gray-400">Room is available</p>
			</div>
		{/if}

		<!--Show only if more meetings than displayed -->
		<div class="row flex justify-center space-y-4 space-x-4 pt-2">
			<div class="flex items-center space-x-2">
				<div class="glass-dot"></div>
				<div class="glass-dot"></div>
				<div class="glass-dot"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.glass-card {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.08),
			0 6px 20px rgba(0, 0, 0, 0.04),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.glass-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.5);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.1),
			0 2px 6px rgba(0, 0, 0, 0.05);
	}

	.glass-empty {
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.1);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.06),
			0 4px 12px rgba(0, 0, 0, 0.03),
			inset 0 1px 0 rgba(255, 255, 255, 0.25);
	}
</style>
