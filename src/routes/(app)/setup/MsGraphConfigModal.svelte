<script lang="ts">
	import { Button, Label, Input, Helper, Toast } from 'flowbite-svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, enhance } from '$app/forms';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';

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
		loading = true;

		return ({ result }: { result: any }) => {
			loading = false;
			error = false;

			if (result.type === 'success') {
				invalidateAll();
				msGraphConfig.reset();
				dialog?.close();
				errors = {};
				error = false;

				if (onSuccess) {
					onSuccess();
				}
			} else if (result.type === 'failure') {
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
	color="blue"
	size="md"
>
	<span class="whitespace-nowrap text-lg font-semibold">Configure Microsoft Graph</span>
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
	{#if !!errors?.global}
		<Toast color="red" dismissable={false} class="mb-4">
			{#snippet icon()}
				<CloseCircleSolid class="h-5 w-5" />
				<span class="sr-only">Error icon</span>
			{/snippet}
			<p class="text-sm">
				{errors.global}
			</p>
		</Toast>
	{/if}
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
				aria-describedby="client-id-helper"
				color={errors?.clientId ? 'red' : 'default'}
			/>
			{#if !!errors?.clientId}
				<Helper class="mt-2" color="red">{errors.clientId}</Helper>
			{/if}
		</div>
		<div>
			<Label for="client-secret" class="mb-2 block">Client Secret</Label>
			<Input
				id="client-secret"
				name="clientSecret"
				type="password"
				placeholder="Enter Client Secret"
				class="w-full"
				aria-describedby="client-secret-helper"
				color={errors?.clientSecret ? 'red' : 'default'}
			/>
			{#if !!errors?.clientSecret}
				<Helper class="mt-2" color="red">{errors.clientSecret}</Helper>
			{/if}
		</div>
		<div>
			<Label for="tenant-id" class="mb-2 block">Tenant Id</Label>
			<Input
				id="tenant-id"
				name="tenantId"
				type="password"
				placeholder="Enter Tenant Id"
				class="w-full"
				aria-describedby="tenant-id-helper"
				color={errors?.tenantId ? 'red' : 'default'}
			/>
			{#if !!errors?.tenantId}
				<Helper class="mt-2" color="red">{errors.tenantId}</Helper>
			{/if}
		</div>
	</form>
	{#snippet footer()}
		<Button type="submit" form="authConfigform">Apply</Button>
		<Button color="alternative" onclick={handleCloseDialog}>Cancel</Button>
	{/snippet}
</Dialog>
