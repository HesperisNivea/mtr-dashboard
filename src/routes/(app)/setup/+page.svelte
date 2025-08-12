<script lang="ts">
	import type { PageData } from './$types.js';
	import { invalidateAll } from '$app/navigation';
	import MsGraphConfigModal from './MsGraphConfigModal.svelte';
	import RoomMagnager from './RoomMagnager.svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	async function handleConfigSuccess() {
		console.log('Configuration successful, refreshing room data...');
		await invalidateAll();
	}

	async function refreshRooms() {
		console.log('Refreshing room data...');
		await invalidateAll();
	}
</script>

<div class="container mx-auto flex max-w-screen-lg flex-col">
	<div
		class="mb-6 flex flex-wrap items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-md"
	>
		<div class="mb-4 w-full md:mb-0 md:w-auto">
			<h1 class="text-3xl font-extrabold text-gray-900">Setup Microsoft Graph Configuration</h1>
			<p class="mt-2 text-sm text-gray-600">
				Please configure your Microsoft Graph settings to proceed.
			</p>
		</div>
		<div class="flex w-full gap-2 md:w-auto">
			<MsGraphConfigModal onSuccess={handleConfigSuccess} />
			<button
				class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				onclick={refreshRooms}
			>
				Refresh Rooms
			</button>
		</div>
	</div>
	<div
		class="mb-6 flex flex-wrap items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-md"
	>
		<RoomMagnager rooms={data.rooms} error={data.error}></RoomMagnager>
	</div>
</div>
