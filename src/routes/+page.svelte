<script lang="ts">
	import { onMount } from 'svelte';
	import type { AgendaEvent } from '../types/agenda.js';
	import RoomCard from '$lib/components/MettingDashboardComponent/RoomCard.svelte';
	import type { PageProps } from './$types.js';
	import type { Room } from '@microsoft/microsoft-graph-types';
	import { Button } from 'flowbite-svelte';

	console.log('🚀 Script loaded in browser');

	let { data }: PageProps = $props();
	let rooms = $state<Room[]>(data.displayedRooms as Room[]);
	let roomEvents = $state<Record<string, AgendaEvent[]>>(data.roomEvents);
	let error = $state<string | undefined>(data.error);

	let maxRows = $state<number>(0);
	let maxColumnsPerRow = $state<number>(0);
	let maxNumberofRooms = $state<number>(0);
	let roomRows = $state<Room[][]>([]);

	// Calculate optimal card distribution across rows
	const calculateRoomLayout = (roomsToDisplay: Room[]): Room[][] => {
		const totalRooms = roomsToDisplay.length;
		if (totalRooms === 0) return [];

		// Calculate how many cards can fit per row based on screen width
		const screenWidth = window.innerWidth;
		const cardWidth = 390; // Base card width including gaps
		const maxCardsPerRow = Math.floor(screenWidth / cardWidth);

		// Calculate optimal distribution
		const rows: Room[][] = [];
		const idealRows = Math.ceil(totalRooms / maxCardsPerRow);

		if (idealRows === 1) {
			// Single row - just add all cards
			rows.push([...roomsToDisplay]);
		} else {
			// Multiple rows - distribute evenly
			const cardsPerRow = Math.ceil(totalRooms / idealRows);

			for (let i = 0; i < idealRows; i++) {
				const startIndex = i * cardsPerRow;
				const endIndex = Math.min(startIndex + cardsPerRow, totalRooms);
				if (startIndex < totalRooms) {
					rows.push(roomsToDisplay.slice(startIndex, endIndex));
				}
			}
		}

		return rows;
	};

	// Function to remove past meetings
	const cleanupPastMeetings = () => {
		const now = new Date();
		const updatedRoomEvents: Record<string, AgendaEvent[]> = {};

		for (const [roomEmail, events] of Object.entries(roomEvents)) {
			// Filter out meetings that have ended
			const currentEvents = events.filter((event) => {
				const endTime = new Date(event.end.dateTime);
				return endTime > now; // Keep meetings that haven't ended yet
			});
			updatedRoomEvents[roomEmail] = currentEvents;
		}

		roomEvents = updatedRoomEvents;
	};

	// Function to refresh meeting data from tenant
	const refreshMeetingsFromTenant = async () => {
		try {
			console.log('Refreshing meetings from tenant...');
			const updatedRoomEvents: Record<string, AgendaEvent[]> = {};

			// Fetch fresh data for each room
			for (const room of rooms) {
				if (room.emailAddress) {
					try {
						const response = await fetch(
							`/api/events?roomEmail=${encodeURIComponent(room.emailAddress)}`
						);
						if (response.ok) {
							const events: AgendaEvent[] = await response.json();
							updatedRoomEvents[room.emailAddress] = events;
						} else {
							console.error(
								`Failed to fetch events for ${room.emailAddress}:`,
								response.statusText
							);
							// Keep existing events if fetch fails
							updatedRoomEvents[room.emailAddress] = roomEvents[room.emailAddress] || [];
						}
					} catch (error) {
						console.error(`Error fetching events for ${room.emailAddress}:`, error);
						// Keep existing events if fetch fails
						updatedRoomEvents[room.emailAddress] = roomEvents[room.emailAddress] || [];
					}
				}
			}

			roomEvents = updatedRoomEvents;
			console.log('Successfully refreshed meetings from tenant');
		} catch (error) {
			console.error('Error refreshing meetings from tenant:', error);
		}
	};

	onMount(() => {
		console.log('🔧 onMount started');

		// Calculate the number of columns and rows based on the screen size
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		maxColumnsPerRow = Math.floor(screenWidth / 390);
		maxRows = Math.floor(screenHeight / 620);
		maxNumberofRooms = maxRows * maxColumnsPerRow;

		console.log('📐 Layout calculated:', { maxColumnsPerRow, maxRows, maxNumberofRooms });

		// Calculate room layout
		const displayedRooms = rooms.slice(0, maxNumberofRooms);
		roomRows = calculateRoomLayout(displayedRooms);

		console.log('⏱️ Setting up intervals...');

		// Start recurring cleanup every minute (60000ms)
		const cleanupInterval = setInterval(() => {
			console.log('🧹 Running cleanup...');
			cleanupPastMeetings();
		}, 60000);

		// Start recurring refresh from tenant every 10 minutes (600000ms)
		const refreshInterval = setInterval(() => {
			console.log('🔄 Starting refresh interval...');
			refreshMeetingsFromTenant();
		}, 600000);

		console.log('✅ Intervals set up successfully');

		// Cleanup intervals on component destroy
		return () => {
			console.log('🧽 Cleaning up intervals');
			clearInterval(cleanupInterval);
			clearInterval(refreshInterval);
		};
	});

	// Recalculate layout when rooms change
	$effect(() => {
		if (maxNumberofRooms > 0) {
			const displayedRooms = rooms.slice(0, maxNumberofRooms);
			roomRows = calculateRoomLayout(displayedRooms);
		}
	});
</script>

<div class="h-screen w-full overflow-y-clip bg-slate-500">
	<div class="flex h-screen flex-col gap-2 p-2">
		{#if rooms.length <= 0}
			<div class="flex h-screen w-full items-center justify-center">
				<div
					class="glass-card flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-50/70 to-indigo-100/60 p-8"
				>
					<p class="mb-4 text-xl text-slate-700">No room available for display</p>
					<Button href="/setup" size="lg" color="dark">Add Room</Button>
				</div>
			</div>
		{:else}
			{#each roomRows as row, rowIndex}
				<div class="flex flex-row gap-2" style="flex: 1;">
					{#each row as room, cardIndex}
						<div
							class="room-card-container"
							style="flex: 1; max-width: {100 / roomRows[0].length}%;"
						>
							<RoomCard
								roomName={room.displayName}
								numberOfMeetings={roomEvents[room.emailAddress!].length || 0}
								meetings={roomEvents[room.emailAddress!]}
							/>
						</div>
					{/each}
					<!-- Fill remaining space if this row has fewer cards than the first row -->
					{#if row.length < roomRows[0].length}
						{#each Array(roomRows[0].length - row.length) as _}
							<div
								class="room-card-container"
								style="flex: 1; max-width: {100 / roomRows[0].length}%;"
							></div>
						{/each}
					{/if}
				</div>
			{/each}
		{/if}

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
	</div>
</div>

<style>
	.room-card-container {
		min-width: 350px;
		display: flex;
		flex-direction: column;
	}
</style>
