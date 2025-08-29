<script lang="ts">
	import type { Room } from '../../../types/room.js';
	import { invalidateAll } from '$app/navigation';
	import { Button } from 'flowbite-svelte';

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

			await invalidateAll(); // Refresh the page data
			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			console.error('API call failed:', error);
			throw error; // Re-throw to let caller handle the error
		} finally {
			isLoading = false;
		}
	}

	const addRoom = async (event: SubmitEvent) => {
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
	};

	async function removeRoom(roomId: string) {
		if (confirm('Are you sure you want to remove this room?')) {
			try {
				await makeApiCall('remove', { roomId });
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to remove room';
				showMessage(errorMessage, 'error');
			}
		}
	}

	async function toggleRoomDisplay(roomId: string) {
		try {
			await makeApiCall('toggle', { roomId });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to toggle room display';
			showMessage(errorMessage, 'error');
		}
	}

	async function refreshRoomsFromTenant() {
		if (
			confirm('This will fetch rooms from your tenant and override the current list. Continue?')
		) {
			try {
				await makeApiCall('refresh');
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Failed to refresh rooms from tenant';
				showMessage(errorMessage, 'error');
			}
		}
	}
</script>

<div class="w-full">
	<!-- Toast Notification -->
	{#if toastVisible}
		<div
			class="fixed right-4 top-4 z-50 max-w-sm transform transition-all duration-300 ease-in-out {toastVisible
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

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Add Room Section -->
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
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
						class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
						bind:value={newRoomEmail}
						disabled={isLoading}
						required
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading || !newRoomEmail.trim()}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? 'Adding...' : 'Add Room'}
				</button>
			</form>
		</div>

		<!-- Refresh from Tenant Section -->
		<div class="flex min-h-[200px] flex-col rounded-lg border border-gray-200 bg-gray-50 p-4">
			<div class="flex-1">
				<h3 class="mb-3 text-lg font-medium text-gray-900">Refresh from Tenant</h3>
				<p class="mb-3 text-sm text-gray-600">
					Fetch the latest rooms from your Microsoft Graph tenant. This will override your current
					room list but preserve display settings.
				</p>
			</div>
			<div class="mt-auto flex justify-end">
				<Button
					class="flex align-bottom"
					onclick={refreshRoomsFromTenant}
					disabled={isLoading}
					color="blue"
				>
					{isLoading ? 'Refreshing...' : 'Refresh Rooms from Tenant'}
				</Button>
			</div>
		</div>
	</div>

	<!-- Rooms Table -->
	<div class="mt-6">
		{#if rooms.length === 0 && !error}
			<div
				class="rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 p-12 text-center"
			>
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						></path>
					</svg>
				</div>
				<h3 class="mt-4 text-lg font-medium text-gray-900">No rooms found</h3>
				<p class="mt-2 text-sm text-gray-600">
					Get started by adding rooms manually or refreshing from your Microsoft Graph tenant.
				</p>
			</div>
		{:else}
			<div class="mb-4 flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
						<svg class="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
								clip-rule="evenodd"
							></path>
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium text-gray-900">
							{rooms.length} room{rooms.length === 1 ? '' : 's'} found
						</p>
						<p class="text-xs text-gray-500">
							{rooms.filter((r) => r.isDisplayed).length} displayed in dashboard
						</p>
					</div>
				</div>
			</div>
		{/if}

		{#if rooms.length > 0}
			<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<table class="w-full min-w-[600px]">
					<thead class="bg-gradient-to-r from-gray-50 to-gray-100">
						<tr>
							<th
								class="w-32 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
							>
								<div class="flex items-center space-x-2">
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									<span>Display</span>
								</div>
							</th>
							<th
								class="w-64 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
							>
								<div class="flex items-center space-x-2">
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
											clip-rule="evenodd"
										></path>
									</svg>
									<span>Room Details</span>
								</div>
							</th>
							<th
								class="w-48 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
							>
								<div class="flex items-center space-x-2">
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
										></path>
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
									</svg>
									<span>Contact</span>
								</div>
							</th>
							<th
								class="w-40 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
							>
								<div class="flex items-center space-x-2">
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
											clip-rule="evenodd"
										></path>
									</svg>
									<span>Location</span>
								</div>
							</th>
							<th
								class="w-32 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600"
							>
								<div class="flex items-center space-x-2">
									<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
											clip-rule="evenodd"
										></path>
									</svg>
									<span>Actions</span>
								</div>
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each rooms as room (room.id)}
							<tr
								class="group transition-colors duration-150 hover:bg-blue-50/50 {room.isDisplayed
									? 'bg-blue-50'
									: 'bg-gray-50'}"
							>
								<td class="px-4 py-4">
									<div class="flex items-center">
										<label class="relative inline-flex cursor-pointer items-center">
											<input
												type="checkbox"
												checked={room.isDisplayed || false}
												onchange={() => toggleRoomDisplay(room.id)}
												disabled={isLoading}
												class="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											/>
											<svg
												class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												></path>
											</svg>
										</label>
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center">
										<div class="ml-3">
											<div class="text-sm font-medium text-gray-900">{room.displayName}</div>
											<div class="text-xs text-gray-500">ID: {room.id.slice(-8)}</div>
										</div>
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="text-sm text-gray-900">{room.emailAddress || 'N/A'}</div>
									<div class="text-xs text-gray-500">Microsoft Graph</div>
								</td>
								<td class="px-4 py-4">
									<div class="flex flex-wrap gap-1">
										{#if room.building}
											<span
												class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
											>
												<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
														clip-rule="evenodd"
													></path>
												</svg>
												{room.building}
											</span>
										{:else}
											<span class="text-sm text-gray-400">—</span>
										{/if}
										{#if room.floor}
											<span
												class="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
											>
												<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
														clip-rule="evenodd"
													></path>
												</svg>
												Floor {room.floor}
											</span>
										{:else}
											<span class="text-sm text-gray-400">—</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center space-x-2">
										<button
											class="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm ring-1 ring-inset ring-red-600/20 transition-colors duration-150 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											onclick={() => removeRoom(room.id)}
											disabled={isLoading}
										>
											<svg class="mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
													clip-rule="evenodd"
												></path>
												<path
													fill-rule="evenodd"
													d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
													clip-rule="evenodd"
												></path>
											</svg>
											{isLoading ? 'Removing...' : 'Remove'}
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
