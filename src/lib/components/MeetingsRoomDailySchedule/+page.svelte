<script lang="ts">
	import type { AgendaEvent } from "../../../types/agenda.js";
    import { onMount } from 'svelte';

    export let meetingRoomName: string;
    export let agenda: AgendaEvent[]; // Initialize agenda variable

    onMount(async () => {
        const mgt = await import('@microsoft/mgt');
        mgt.registerMgtAgendaComponent();

    });


</script>

<div class="container">
    <div class="text-center bg-gray-800 text-white py-4 rounded-t-lg">
        <h1 class="text-2xl font-bold">{meetingRoomName}</h1>
    </div>
    <div class="bg-gray-100 shadow-md rounded-lg p-4">
        <mgt-agenda events={agenda} class="w-full"></mgt-agenda>
    </div>
</div>
       

