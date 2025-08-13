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

	// const onMount = async () => {
	// 	//if method load returns no data or verification fails, handle it here
	// 	// redirect to set up page with open dialog to set up tenant connection
	// 	if (data.error) {
	// 		// Handle error, e.g., redirect to setup page
	// 		window.location.href = '/setup';
	// 		return;
	// 	}
	// };
</script>

<div class=" flex-inline mt-4 px-4">
	<div
		class="grid flex-wrap gap-3"
		style="grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));"
	>
		{#if rooms.length <= 0}
			<p>No rooms available</p>
			<Button>Configure Connection</Button>
		{/if}
		{#each rooms as room (room.id)}
			<RoomCard roomName={room.displayName} numberOfMeetings={roomEvents[room.id!]?.length || 0} />
		{/each}

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}
		<!-- {#each Array.from({ length: textLength }) as _, index}
			<div class="flex w-full justify-center">
				<RoomCard roomName="Conference Room A" numberOfMeetings={agenda.length} />
			</div>
		{/each} -->
	</div>
</div>
