<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
	import { onMount } from 'svelte';
	import type { AgendaEvent } from '../types/agenda.js';
	import MeetingsRoomDailySchedule from '../lib/components/MeetingsRoomDailySchedule/+page.svelte';
	import MeetingCard from '$lib/components/MettingDashboardComponent/MeetingCard.svelte';
	import RoomCard from '$lib/components/MettingDashboardComponent/RoomCard.svelte';
	let mgtComponentsLoaded = false; // Flag to check if MGT components are loaded

	let agenda: AgendaEvent[] = []; // Initialize agenda variable

	let textLength: number = 20; // Initialize textLength variable

	onMount(async () => {
		const mgt = await import('@microsoft/mgt');

		// Register any custom components you need
		mgt.registerMgtAgendaComponent();

		agenda = data.eventsList.map((event) => ({
			subject: event.subject,
			bodyPreview: 'Meeting details', // Add this field
			location: { displayName: 'Meeting Room' }, // Add location with displayName
			organizer: {
				emailAddress: {
					name: 'Organizer',
					address: 'organizer@example.com'
				}
			},
			attendees: [], // Add empty attendees array if needed
			start: {
				dateTime: event.start instanceof Date ? event.start.toISOString() : event.start
			},
			end: {
				dateTime: event.end instanceof Date ? event.end.toISOString() : event.end
			}
		}));

		console.log('Formatted agenda:', agenda);
		mgtComponentsLoaded = true;
	});
</script>



{#if mgtComponentsLoaded}
	<div class=" flex-inline mt-4 px-4">
		<div
			class="grid flex-wrap gap-3"
			style="grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));"
		>
			{#each Array.from({ length: textLength }) as _, index}
				<div class="flex w-full justify-center">
					<RoomCard roomName="Conference Room A" numberOfMeetings={agenda.length} />
					<!-- <MeetingsRoomDailySchedule {agenda} meetingRoomName={`Room ${index + 1}`} /> -->
				</div>
			{/each}
		</div>
	</div>
{/if}
