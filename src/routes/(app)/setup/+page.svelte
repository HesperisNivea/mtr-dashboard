<script lang="ts">
	import type { stat } from 'fs';
	import MsGraphConfigModal from './MsGraphConfigModal.svelte';
	import RoomMagnager from './RoomMagnager.svelte';

	let rooms: string[] = [];

	//  if graph is ready other parts exept etup Microsoft Graph Configuration
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
		<div class="w-full md:w-auto">
			<MsGraphConfigModal
				onSuccess={() => {
					// Handle success, e.g., show a notification or update the UI
					console.log('Configuration successful');
				}}
			/>
		</div>
	</div>
	<div
		class="mb-6 flex flex-wrap items-center justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-md"
	>
		<RoomMagnager></RoomMagnager>
	</div>
</div>
