<script lang="ts">
	import { Button, Label, Input, Helper, Toast } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import Dialog from '$lib/components/Dialog.svelte';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, enhance } from '$app/forms';

	type Props = {
		onSuccess?: () => void;
	};

	let { onSuccess }: Props = $props();

	let msGraphConfig: HTMLFormElement;

	let loading = $state(false);
	let errors = $state<Record<string, string[]>>();
	let error = $state(false);
	let dialog = $state<HTMLDialogElement>();

	const handleSubmit = () => {
		console.log('Form submitted');
		loading = true;

		return ({ result }: { result: any }) => {
			console.log('Server response:', result);
			loading = false;
			error = false;

			if (result.type === 'success') {
				console.log('Success:', result);
				invalidateAll();
				msGraphConfig.reset();
				dialog?.close();
			} else {
				console.error('Error:', result.error);
				error = true;
				errors = result.data?.errors || {};
			}

			applyAction(result);
		};
	};

	const handleCloseDialog = () => {
		invalidateAll();
		msGraphConfig.reset();
		errors = {};
		error = false;
		dialog?.close();
	};
</script>

<Button
	onclick={() => {
		dialog?.showModal();
	}}
	class="mb-4"
>
	Configure Microsoft Graph
</Button>

<Dialog bind:dialog onClose={handleCloseDialog} class="bg-blue rounded p-4 shadow-lg">
	{#snippet title()}
		<h3 class=" text-lg font-semibold">Microsoft Graph Configuration</h3>
	{/snippet}
	<div>
		<p class="mb-2 text-sm text-gray-700">
			To configure Microsoft Graph, you need to provide the Client Id, Client Secret, and Tenant Id
			of your Azure Active Directory application. These credentials are essential for authenticating
			and authorizing access to Microsoft Graph resources.
		</p>
	</div>
	<Toast dismissable={false} transition={slide} toastStatus={error}>
		{#snippet icon()}
			<!-- <CloseCircleSolid class="h-5 w-5" /> -->
			<span class="sr-only">Error icon</span>
		{/snippet}
		Item has been deleted.
	</Toast>
	<form
		bind:this={msGraphConfig}
		id="authConfigform"
		method="POST"
		action="?/login"
		use:enhance={handleSubmit}
		class="flex flex-col gap-4"
	>
		<div>
			<Label for="client-id" class="mb-2 block">Client Id</Label>
			<Input
				id="client-id"
				name="clientId"
				type="password"
				placeholder="Enter Client Id"
				class="w-full"
				required
				aria-describedby="client-id-helper"
			/>
			<Helper id="client-id-helper" class="text-sm text-gray-500">
				The Client Id is a unique identifier for your Azure AD application.
			</Helper>
			<div>
				<Label for="client-secret" class="mb-2 block">Client Secret</Label>
				<Input
					id="client-secret"
					name="clientSecret"
					type="password"
					placeholder="Enter Client Secret"
					class="w-full"
					required
					aria-describedby="client-secret-helper"
				/>
				<Helper id="client-secret-helper" class="text-sm text-gray-500">
					The Client Secret is a confidential key used to authenticate your application with Azure
					AD.
				</Helper>
			</div>
			<div>
				<Label for="tenant-id" class="mb-2 block">Tenant Id</Label>
				<Input
					id="tenant-id"
					name="tenantId"
					type="password"
					placeholder="Enter Tenant Id"
					class="w-full"
					required
					aria-describedby="tenant-id-helper"
				/>
				<Helper id="tenant-id-helper" class="text-sm text-gray-500">
					The Tenant Id is the unique identifier for your Azure AD tenant.
				</Helper>
			</div>
		</div>
	</form>
	{#snippet footer()}
		<Button type="submit" form="authConfigform">Apply</Button>
		<Button color="alternative" onclick={handleCloseDialog}>Cancel</Button>
	{/snippet}
</Dialog>
