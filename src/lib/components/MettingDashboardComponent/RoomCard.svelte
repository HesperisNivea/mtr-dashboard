<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { AgendaEvent } from '../../../types/agenda.js';
	import MeetingCard from './MeetingCard.svelte';

	type Props = {
		roomName?: string;
		numberOfMeetings?: number;
		meetings?: AgendaEvent[];
	};

	let { roomName = 'Meeting Room', numberOfMeetings = 0, meetings = [] }: Props = $props();

	let displayedMeetings = $state<AgendaEvent[]>([]);
	let containerElement = $state<HTMLDivElement | undefined>(undefined);
	let resizeObserver: ResizeObserver;

	const calculateVisibleMeetings = () => {
		if (!containerElement || meetings.length === 0) {
			displayedMeetings = [];
			return;
		}

		const cardHeight = 104; // Static height for meeting cards
		const gap = 8; // space-y-2 = 8px gap between cards
		const containerHeight = containerElement.getBoundingClientRect().height;

		// Calculate how many cards can fit (always at least one)
		let visibleCards = Math.max(1, Math.floor((containerHeight + gap) / (cardHeight + gap)));
		visibleCards = Math.min(visibleCards, meetings.length);

		displayedMeetings = meetings.slice(0, visibleCards);
	};

	onMount(() => {
		// Set up ResizeObserver to watch container size changes
		if (typeof ResizeObserver !== 'undefined') {
			resizeObserver = new ResizeObserver(() => {
				calculateVisibleMeetings();
			});
		}

		// Fallback: window resize listener
		const handleResize = () => {
			calculateVisibleMeetings();
		};
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	// Effect to start observing when containerElement is available
	$effect(() => {
		if (containerElement && resizeObserver) {
			resizeObserver.observe(containerElement);
		}
	});

	onDestroy(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	});

	// Recalculate when meetings prop changes or container becomes available
	$effect(() => {
		if (meetings.length > 0 && containerElement) {
			// Use setTimeout to ensure DOM is rendered
			setTimeout(calculateVisibleMeetings, 10);
		}
	});

	const setMeetingtoOngoing = (meeting: AgendaEvent) => {
		return (
			new Date(meeting.start.dateTime) <= new Date() && new Date(meeting.end.dateTime) >= new Date()
		);
	};
</script>

<div class="glass-card relative flex h-full flex-col space-y-2 rounded-xl bg-blue-100 px-3 py-6">
	<div class="text-center">
		<h3 class="text-2xl font-bold text-gray-800 drop-shadow-sm">{roomName}</h3>
		<p class="text-sm font-medium text-gray-600">{numberOfMeetings} meetings scheduled</p>
	</div>

	<div bind:this={containerElement} class="h-full w-full flex-1 space-y-4">
		{#if numberOfMeetings > 0}
			<ul class="meeting-cardh-full w-full flex-1 space-y-2">
				{#each displayedMeetings as meeting (meeting.id)}
					<MeetingCard
						title={meeting.subject}
						startTime={meeting.start.dateTime}
						endTime={meeting.end.dateTime}
						ongoing={setMeetingtoOngoing(meeting)}
					/>
				{/each}
			</ul>
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
	</div>
	<!--Show only if more meetings than displayed -->
	{#if meetings.length > displayedMeetings.length}
		<div class="row flex justify-center">
			<div class="flex items-center space-x-2">
				<div class="glass-dot"></div>
				<div class="glass-dot"></div>
				<div class="glass-dot"></div>
			</div>
		</div>
	{/if}
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

	.meeting-card {
		height: 120px; /* Static height for consistent calculation */
		overflow: hidden; /* Prevent content overflow */
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
