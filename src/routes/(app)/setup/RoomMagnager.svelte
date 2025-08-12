<script lang="ts">
	import type { Room } from '../../../types/room.js';
	import { invalidateAll } from '$app/navigation';

	type Props = {
		rooms: Room[];
		error?: string;
	};

	let { rooms, error }: Props = $props();

	let newRoomEmail = $state('');
	let isLoading = $state(false);
	let statusMessage = $state('');
	let statusType: 'success' | 'error' | '' = $state('');
	let toastMessage = $state('');
	let toastType: 'success' | 'error' | 'warning' | '' = $state('');
	let toastVisible = $state(false);

	function showMessage(message: string, type: 'success' | 'error') {
		statusMessage = message;
		statusType = type;
		setTimeout(() => {
			statusMessage = '';
			statusType = '';
		}, 5000);
	}

	function showToast(message: string, type: 'success' | 'error' | 'warning') {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
		setTimeout(() => {
			toastVisible = false;
			setTimeout(() => {
				toastMessage = '';
				toastType = '';
			}, 300); // Wait for fade out animation
		}, 4000);
	}

	async function makeApiCall(action: string, data?: any) {
		try {
			isLoading = true;
			const response = await fetch('/api/rooms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ action, ...data })
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || 'Operation failed');
			}

			showMessage(result.message, 'success');
			await invalidateAll(); // Refresh the page data
			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			showMessage(errorMessage, 'error');
			console.error('API call failed:', error);
		} finally {
			isLoading = false;
		}
	}

	async function addRoom(event: SubmitEvent) {
		event.preventDefault();

		if (!newRoomEmail.trim()) {
			showToast('Please enter a valid email address', 'error');
			return;
		}

		try {
			isLoading = true;

			// First validate the email against the tenant
			const validateResponse = await fetch('/api/rooms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					action: 'validate',
					email: newRoomEmail.trim()
				})
			});

			const validateResult = await validateResponse.json();

			if (validateResult.success) {
				// Room found in tenant, add it with full details
				const addResponse = await fetch('/api/rooms', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						action: 'addWithValidation',
						email: newRoomEmail.trim()
					})
				});

				const addResult = await addResponse.json();

				if (addResult.success) {
					showMessage('Room successfully added from tenant', 'success');
					showToast(`✓ Room "${validateResult.room.displayName}" added successfully`, 'success');
					await invalidateAll();
					newRoomEmail = '';
				} else {
					throw new Error(addResult.error || 'Failed to add room');
				}
			} else {
				// Room not found in tenant, show warning toast but allow manual addition
				showToast(`⚠️ Room not found in tenant: ${validateResult.error}`, 'warning');

				// Ask user if they want to add manually
				const addManually = confirm(
					`Room "${newRoomEmail}" was not found in your tenant.\n\nWould you like to add it manually anyway?\n\nNote: This room may not work correctly for calendar integration.`
				);

				if (addManually) {
					const manualRoom = {
						id: `manual-${Date.now()}`,
						displayName: newRoomEmail.split('@')[0] || 'Manual Room',
						emailAddress: newRoomEmail.trim(),
						isDisplayed: false
					};

					const addResponse = await fetch('/api/rooms', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							action: 'add',
							room: manualRoom
						})
					});

					const addResult = await addResponse.json();

					if (addResult.success) {
						showMessage('Room added manually (not validated)', 'success');
						showToast('📝 Room added manually - may not work for calendar sync', 'warning');
						await invalidateAll();
						newRoomEmail = '';
					} else {
						throw new Error(addResult.error || 'Failed to add manual room');
					}
				}
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to add room';
			showMessage(errorMessage, 'error');
			showToast(`❌ ${errorMessage}`, 'error');
		} finally {
			isLoading = false;
		}
	}

	async function removeRoom(roomId: string) {
		if (confirm('Are you sure you want to remove this room?')) {
			await makeApiCall('remove', { roomId });
		}
	}

	async function toggleRoomDisplay(roomId: string) {
		await makeApiCall('toggle', { roomId });
	}

	async function refreshRoomsFromTenant() {
		if (
			confirm('This will fetch rooms from your tenant and override the current list. Continue?')
		) {
			await makeApiCall('refresh');
		}
	}
</script>

<div class="w-full">
	<h2 class="text-2xl font-semibold text-gray-900">Room Management</h2>
	<p class="mt-2 text-sm text-gray-600">Manage your rooms and their configurations here.</p>

	<!-- Toast Notification -->
	{#if toastVisible}
		<div
			class="fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ease-in-out {toastVisible
				? 'translate-x-0 opacity-100'
				: 'translate-x-full opacity-0'}"
		>
			<div
				class="rounded-lg border-l-4 p-4 shadow-lg {toastType === 'success'
					? 'border-green-400 bg-green-50 text-green-800'
					: toastType === 'warning'
						? 'border-yellow-400 bg-yellow-50 text-yellow-800'
						: 'border-red-400 bg-red-50 text-red-800'}"
			>
				<div class="flex">
					<div class="flex-1">
						<p class="text-sm font-medium">{toastMessage}</p>
					</div>
					<button
						onclick={() => {
							toastVisible = false;
						}}
						class="ml-3 text-gray-400 hover:text-gray-600"
					>
						<span class="sr-only">Close</span>
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if statusMessage}
		<div
			class="mb-4 rounded border {statusType === 'success'
				? 'border-green-400 bg-green-100 text-green-700'
				: 'border-red-400 bg-red-100 text-red-700'} p-4"
		>
			<span class="font-medium">{statusType === 'success' ? 'Success:' : 'Error:'}</span>
			{statusMessage}
		</div>
	{/if}

	{#if error}
		<div class="mb-4 rounded border border-yellow-400 bg-yellow-100 p-4 text-yellow-700">
			<span class="font-medium">Warning:</span>
			{error}
		</div>
	{/if}

	<!-- Add Room Section -->
	<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
		<h3 class="mb-3 text-lg font-medium text-gray-900">Add Room</h3>
		<p class="mb-3 text-sm text-gray-600">
			Enter a room email address. The system will first check if it exists in your tenant before
			adding it.
		</p>

		<form class="flex items-end gap-2" onsubmit={addRoom}>
			<div class="flex-1">
				<label for="room-email" class="mb-2 block text-sm font-medium text-gray-700">
					Meeting Room Email:
				</label>
				<input
					id="room-email"
					type="email"
					placeholder="Enter Meeting Room email"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					bind:value={newRoomEmail}
					disabled={isLoading}
					required
				/>
			</div>
			<button
				type="submit"
				disabled={isLoading || !newRoomEmail.trim()}
				class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isLoading ? 'Adding...' : 'Add Room'}
			</button>
		</form>
	</div>

	<!-- Refresh from Tenant Section -->
	<div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
		<h3 class="mb-3 text-lg font-medium text-gray-900">Refresh from Tenant</h3>
		<p class="mb-3 text-sm text-gray-600">
			Fetch the latest rooms from your Microsoft Graph tenant. This will override your current room
			list but preserve display settings.
		</p>
		<button
			onclick={refreshRoomsFromTenant}
			disabled={isLoading}
			class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		>
			{isLoading ? 'Refreshing...' : 'Refresh Rooms from Tenant'}
		</button>
	</div>

	<!-- Rooms Table -->
	<div class="mt-4">
		{#if rooms.length === 0 && !error}
			<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
				<p class="text-gray-600">
					No rooms found. Add rooms manually above or refresh from your tenant.
				</p>
			</div>
		{:else}
			<p class="mb-4 text-sm text-gray-600">
				Found {rooms.length} room{rooms.length === 1 ? '' : 's'}
				({rooms.filter((r) => r.isDisplayed).length} displayed in dashboard):
			</p>
		{/if}

		{#if rooms.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full border border-gray-200 text-left text-sm text-gray-500">
					<thead class="bg-gray-50 text-xs text-gray-700 uppercase">
						<tr>
							<th scope="col" class="border-b px-4 py-3">Display</th>
							<th scope="col" class="border-b px-6 py-3">Room Name</th>
							<th scope="col" class="border-b px-6 py-3">Email Address</th>
							<th scope="col" class="border-b px-6 py-3">Building</th>
							<th scope="col" class="border-b px-6 py-3">Floor</th>
							<th scope="col" class="border-b px-6 py-3">Capacity</th>
							<th scope="col" class="border-b px-6 py-3">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each rooms as room (room.id)}
							<tr class="border-b bg-white hover:bg-gray-50">
								<td class="px-4 py-4">
									<input
										type="checkbox"
										checked={room.isDisplayed || false}
										onchange={() => toggleRoomDisplay(room.id)}
										disabled={isLoading}
										class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
								</td>
								<td class="px-6 py-4 font-medium text-gray-900">{room.displayName}</td>
								<td class="px-6 py-4">{room.emailAddress || 'N/A'}</td>
								<td class="px-6 py-4">{room.building || 'N/A'}</td>
								<td class="px-6 py-4">{room.floor || 'N/A'}</td>
								<td class="px-6 py-4">{room.capacity ? room.capacity.toString() : 'N/A'}</td>
								<td class="px-6 py-4">
									<button
										class="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => removeRoom(room.id)}
										disabled={isLoading}
									>
										{isLoading ? 'Removing...' : 'Remove'}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
