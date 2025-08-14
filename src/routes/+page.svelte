<script lang="ts">
	import { onMount } from 'svelte';
	import type { AgendaEvent } from '../types/agenda.js';
	import RoomCard from '$lib/components/MettingDashboardComponent/RoomCard.svelte';
	import type { PageProps } from './$types.js';
	import type { Room } from '@microsoft/microsoft-graph-types';
	import Button from '$lib/components/Button.svelte';

	let { data }: PageProps = $props();
	let rooms = $state<Room[]>(data.displayedRooms as Room[]);
	let roomEvents = $state<Record<string, AgendaEvent[]>>(data.roomEvents ?? {});
	let error = $state<string | undefined>(data.error);

	let rows = $state<number>(0);
	let columns = $state<number>(0);
	let maxNumberofRooms = $state<number>(0);

	// if rooms less than 6, use first card grid setting
	// if rooms more than 6 but less than 12, use second card grid setting
	// if rooms more than 12, use third card grid setting

	onMount(() => {
		// Calculate the number of columns and rows based on the screen size
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		columns = Math.floor(screenWidth / 390);
		rows = Math.floor(screenHeight / 612);
		maxNumberofRooms = rows * columns;

		console.log('Max Number of Rooms:', maxNumberofRooms);
		console.log('Columns:', columns);
		console.log('Rows:', rows);
	});
</script>

<div class=" h-screen w-full overflow-y-clip">
	<div class="flex h-screen flex-row flex-wrap items-stretch gap-4 p-4">
		{#if rooms.length <= 0}
			<p>No rooms available</p>
			<Button>Configure Connection</Button>
		{/if}
		{#each rooms.slice(0, maxNumberofRooms) as room}
			<div class="min-w-sm col-span-1 flex-1">
				<RoomCard
					roomName={room.displayName}
					numberOfMeetings={roomEvents[room.id!]?.length || 8}
				/>
			</div>
		{/each}

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
	</div>
</div>
