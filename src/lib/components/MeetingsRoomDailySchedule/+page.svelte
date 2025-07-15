<script lang="ts">
	import type { AgendaEvent } from '../../../types/agenda.js';
	import { onMount } from 'svelte';

	export let meetingRoomName: string;
	export let agenda: AgendaEvent[]; // Initialize agenda variable

	onMount(async () => {
		const mgt = await import('@microsoft/mgt');
		mgt.registerMgtAgendaComponent();
	});
</script>


<div class="container">
	<div class="rounded-t-lg bg-gray-800 py-4 text-center text-white">
		<h1 class="text-2xl font-bold">{meetingRoomName}</h1>
	</div>
	<div class="rounded-lg bg-gray-100 p-4 shadow-md">
		<mgt-agenda events={agenda} class="w-full"></mgt-agenda>
	</div>
</div>
