<script lang="ts">
	import type { PageCollection } from '@microsoft/microsoft-graph-client';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>User List</h1>
<ul>
	{#each data.userList as user (user.id)}
		<li>{user.displayName}</li>
	{/each}
</ul>

<h1>Meeting List</h1>
<ul>
	{#each data.eventsList as event ((event.subject, event.start))}
		<li>{event.subject}</li>
		<li>{(event.subject, event.start)}</li>
	{/each}
</ul>
