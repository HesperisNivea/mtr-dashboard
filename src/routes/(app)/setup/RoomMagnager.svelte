<script lang="ts">
	import type { Room } from '../../../types/room.js';

	type Props = {
		rooms: Room[];
		error?: string;
	};

	let { rooms, error }: Props = $props();

	let newRoomEmail = $state('');

	function addRoom(event: SubmitEvent) {
		event.preventDefault();
		// TODO: Implement room addition logic
		console.log('Adding room with email:', newRoomEmail);
		newRoomEmail = '';
	}

	function removeRoom(roomId: string) {
		// TODO: Implement room removal logic
		console.log('Removing room with ID:', roomId);
	}
</script>

<div class="w-full">
	<h2 class="text-2xl font-semibold text-gray-900">Room Management</h2>
	<p class="mt-2 text-sm text-gray-600">Manage your rooms and their configurations here.</p>

	{#if error}
		<div class="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
			<span class="font-medium">Error loading rooms:</span>
			{error}
		</div>
	{/if}

	<div class="mb-4">
		<form class="flex items-end gap-2" onsubmit={addRoom}>
			<div class="flex-1">
				<label for="room-email" class="mb-2 block text-sm font-medium text-gray-700"
					>Meeting Room email:</label
				>
				<input
					id="room-email"
					type="email"
					placeholder="Enter Meeting Room email"
					class="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					bind:value={newRoomEmail}
					required
				/>
			</div>
			<button
				type="submit"
				class="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Add Room
			</button>
		</form>
	</div>

	<div class="mt-4">
		{#if rooms.length === 0 && !error}
			<p class="text-sm text-gray-600">
				No rooms found. Configure MS Graph credentials and refresh to load available rooms.
			</p>
		{:else}
			<p class="mb-4 text-sm text-gray-600">
				Found {rooms.length} available room{rooms.length === 1 ? '' : 's'}:
			</p>
		{/if}

		<div class="overflow-x-auto">
			<table class="w-full border border-gray-200 text-left text-sm text-gray-500">
				<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
					<tr>
						<th scope="col" class="border-b px-6 py-3">Room Name</th>
						<th scope="col" class="border-b px-6 py-3">Email Address</th>
						<th scope="col" class="border-b px-6 py-3">Building</th>
						<th scope="col" class="border-b px-6 py-3">Floor</th>
						<th scope="col" class="border-b px-6 py-3">Capacity</th>
						<th scope="col" class="border-b px-6 py-3">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if rooms.length === 0}
						<tr class="border-b bg-white">
							<td colspan="6" class="px-6 py-8 text-center text-gray-500">
								{error ? 'Unable to load rooms due to configuration error' : 'No rooms available'}
							</td>
						</tr>
					{:else}
						{#each rooms as room (room.id)}
							<tr class="border-b bg-white hover:bg-gray-50">
								<td class="px-6 py-4 font-medium text-gray-900">{room.displayName}</td>
								<td class="px-6 py-4">{room.emailAddress || 'N/A'}</td>
								<td class="px-6 py-4">{room.building || 'N/A'}</td>
								<td class="px-6 py-4">{room.floor || 'N/A'}</td>
								<td class="px-6 py-4">{room.capacity ? room.capacity.toString() : 'N/A'}</td>
								<td class="px-6 py-4">
									<button
										class="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
										onclick={() => removeRoom(room.id)}
									>
										Remove
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
