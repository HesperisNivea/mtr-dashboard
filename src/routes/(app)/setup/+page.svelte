<script lang="ts">
	import type { PageData } from './$types.js';
	import { invalidateAll } from '$app/navigation';
	import MsGraphConfigModal from './MsGraphConfigModal.svelte';
	import RoomMagnager from './RoomMagnager.svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	const handleConfigSuccess = async () => {
		await invalidateAll();
	};

	const getRoomsFromTenant = async () => {
		const action = 'refresh';
		try {
			const response = await fetch('/api/rooms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ action, ...data })
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to get rooms from tenant';
		}
	};
</script>

<div class="bg-slate-300">
	<div class="container mx-auto flex max-w-screen-lg flex-col pt-[100px]">
		<!-- Microsoft Graph Configuration - Primary Setup Section -->
		<div class="mb-8">
			<div
				class="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 shadow-xl ring-1 ring-blue-200/50"
			>
				<!-- Subtle Background Pattern -->
				<div class="absolute inset-0 opacity-5">
					<div
						class="absolute inset-0"
						style="background-image: radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px); background-size: 32px 32px;"
					></div>
				</div>
				<!-- Content -->
				<div class="relative z-10">
					<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
						<div class="flex-1">
							<!-- Priority Badge -->
							<div
								class="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
							>
								<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									></path>
								</svg>
								Required Setup
							</div>
							<!-- Main Heading -->
							<h1 class="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
								Microsoft Graph Configuration
							</h1>
							<!-- Description -->
							<p class="mb-6 text-lg text-gray-600">
								Connect your Microsoft 365 tenant to enable calendar integration and room
								management. This is the foundation for your meeting dashboard.
							</p>
						</div>
						<!-- Action Button -->
						<div class="flex-shrink-0">
							<MsGraphConfigModal onSuccess={handleConfigSuccess} />
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Room Management Section -->
		<div class="mb-8">
			<div
				class="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 p-8 shadow-xl ring-1 ring-slate-200/50"
			>
				<!-- Subtle Background Pattern -->
				<div class="absolute inset-0 opacity-5">
					<div
						class="absolute inset-0"
						style="background-image: radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px); background-size: 32px 32px;"
					></div>
				</div>

				<!-- Content -->
				<div class="relative z-10">
					<div class="flex flex-col gap-6">
						<div class="flex items-center">
							<!-- Section Icon -->
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
								<svg class="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
										clip-rule="evenodd"
									></path>
								</svg>
							</div>

							<!-- Section Header -->
							<div class="ml-4">
								<h2 class="text-2xl font-bold text-gray-900">Room Management</h2>
								<p class="text-sm text-gray-600">Manage your meeting rooms and their settings</p>
							</div>
						</div>

						<!-- Room Manager Component -->
						<div class="rounded-lg bg-white/40 p-6 backdrop-blur-sm">
							<RoomMagnager rooms={data.rooms} error={data.error}></RoomMagnager>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
