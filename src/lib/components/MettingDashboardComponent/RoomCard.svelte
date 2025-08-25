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

	const formatTime = (time: string) => {
		const date = new Date(time);
		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
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
		const now = new Date();
		return new Date(meeting.start.dateTime) <= now && new Date(meeting.end.dateTime) >= now;
	};
</script>

<div
	class="glass-card relative flex h-full flex-col space-y-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 shadow-xl"
>
	<div class="text-center">
		<h3 class="text-5xl font-bold tracking-tight text-slate-800 drop-shadow-lg">{roomName}</h3>
		<!-- <p class="text-sm font-medium text-gray-600">{numberOfMeetings} meetings scheduled</p> -->
	</div>

	<div
		bind:this={containerElement}
		class="glass-inner h-full w-full flex-1 space-y-3 rounded-xl p-3 shadow-inner"
	>
		{#if numberOfMeetings > 0}
			<ul class="w-full flex-1 space-y-3">
				{#each displayedMeetings as meeting (meeting.id)}
					<MeetingCard
						title={meeting.subject}
						startTime={formatTime(meeting.start.dateTime)}
						endTime={formatTime(meeting.end.dateTime)}
						ongoing={setMeetingtoOngoing(meeting)}
					/>
				{/each}
			</ul>
		{:else}
			<div
				class="glass-empty flex min-h-[200px] flex-col items-center justify-center rounded-xl p-8"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg"
				>
					<svg class="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<p class="text-center text-lg font-semibold text-slate-700">No meetings scheduled</p>
				<p class="mt-2 text-sm font-medium text-slate-500">Room is available</p>
			</div>
		{/if}
	</div>
	<!--Show only if more meetings than displayed -->
	{#if meetings.length > displayedMeetings.length}
		<div class="row flex justify-center">
			<div class="flex items-center space-x-2">
				<div class="glass-dot animate-pulse"></div>
				<div class="glass-dot animate-pulse" style="animation-delay: 0.2s;"></div>
				<div class="glass-dot animate-pulse" style="animation-delay: 0.4s;"></div>
			</div>
		</div>
	{/if}
</div>

<style>
	.glass-card {
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.12),
			0 8px 30px rgba(0, 0, 0, 0.08),
			inset 0 2px 0 rgba(255, 255, 255, 0.4),
			inset 0 -1px 0 rgba(0, 0, 0, 0.05);
	}

	.glass-inner {
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.15);
		box-shadow:
			inset 0 2px 8px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.meeting-card {
		height: 120px; /* Static height for consistent calculation */
		overflow: hidden; /* Prevent content overflow */
	}

	.glass-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.4));
		border: 1px solid rgba(255, 255, 255, 0.3);
		box-shadow:
			0 6px 16px rgba(0, 0, 0, 0.12),
			0 3px 8px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.glass-empty {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
		box-shadow:
			0 12px 32px rgba(0, 0, 0, 0.08),
			0 6px 16px rgba(0, 0, 0, 0.04),
			inset 0 2px 0 rgba(255, 255, 255, 0.3),
			inset 0 -1px 0 rgba(0, 0, 0, 0.05);
	}
</style>
