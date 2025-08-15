<script lang="ts">
	import { onMount } from 'svelte';
	import type { AgendaEvent } from '../types/agenda.js';
	import RoomCard from '$lib/components/MettingDashboardComponent/RoomCard.svelte';
	import type { PageProps } from './$types.js';
	import type { Room } from '@microsoft/microsoft-graph-types';
	import Button from '$lib/components/Button.svelte';

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

	onMount(() => {
		// Calculate the number of columns and rows based on the screen size
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		maxColumnsPerRow = Math.floor(screenWidth / 390);
		maxRows = Math.floor(screenHeight / 612);
		maxNumberofRooms = maxRows * maxColumnsPerRow;

		// Calculate room layout
		const displayedRooms = rooms.slice(0, maxNumberofRooms);
		roomRows = calculateRoomLayout(displayedRooms);
	});

	// Recalculate layout when rooms change
	$effect(() => {
		if (maxNumberofRooms > 0) {
			const displayedRooms = rooms.slice(0, maxNumberofRooms);
			roomRows = calculateRoomLayout(displayedRooms);
		}
	});
</script>

<div class="h-screen w-full overflow-y-clip">
	<div class="flex h-screen flex-col gap-4 p-4">
		{#if rooms.length <= 0}
			<div class="flex h-full flex-col items-center justify-center">
				<p>No rooms available</p>
				<Button>Configure Connection</Button>
			</div>
		{:else}
			{#each roomRows as row, rowIndex}
				<div class="flex flex-row gap-4" style="flex: 1;">
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
