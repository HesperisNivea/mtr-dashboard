<script lang="ts">
	import type { PageData } from './$types.js';
	export let data: PageData;
	import { onMount } from 'svelte';

	let mgtComponentsLoaded = false; // Flag to check if MGT components are loaded
	type AgendaEvent = {
		subject: string;
		bodyPreview: string;
		location: { displayName: string };
		organizer: { emailAddress: { name: string; address: string } };
		attendees: { emailAddress: { name: string; address: string } }[];
		start: { dateTime: string };
		end: { dateTime: string };
	};

	let agenda: AgendaEvent[] = []; // Initialize agenda variable

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

<h1>User List</h1>
<ul>
	{#each data.userList as user (user.id)}
		<li>{user.displayName}</li>
	{/each}
</ul>

{#if mgtComponentsLoaded}
	<!-- Pass your formatted data to the events attribute -->
	<mgt-agenda show-max="5" days="3" events={agenda}></mgt-agenda>
{/if}

<h1>Meeting List</h1>
<ul>
	{#each data.eventsList as event ((event.subject, event.start))}
		<li>{event.subject}</li>
		<li>{(event.subject, event.start)}</li>
	{/each}
</ul>
