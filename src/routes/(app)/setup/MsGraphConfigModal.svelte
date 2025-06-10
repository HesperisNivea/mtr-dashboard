<script lang="ts">
	import { Button, Label, Input } from 'flowbite-svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { invalidateAll } from '$app/navigation';

	type Props = {
		onSuccess?: () => void;
	};

	let { onSuccess }: Props = $props();

	let loading = $state(false);
	let error: string | null = null;
	let success = false;
	let dialog = $state<HTMLDialogElement>();

	const handleSubmit = () => {
		loading = true;

		return ({ result }: { result: any }) => {
			loading = false;
			if (result.type === 'success') {
				invalidateAll();
				handleCloseDialog();
				success = true;
				error = null;
				dialog?.close();
			} else if (result.type === 'error') {
				error = result.error.message;
				success = false;
			}
			if (result.type === 'failure') {
				error = result.error.message;
				success = false;
			}
		};
	};

	const handleCloseDialog = () => {
		dialog?.close();
	};
</script>

<Button
	onclick={() => {
		dialog?.showModal();
	}}
	class="mb-4"
>
	Open Dialog
</Button>

<Dialog bind:dialog onClose={handleCloseDialog} class="bg-blue rounded p-4 shadow-lg">
	<form id="authConfigform" method="POST" action="?/login" class="flex flex-col gap-4 px-6 py-4">
		<div>
			<Label for="client-id" class="mb-2 block">Client Id</Label>
			<Input
				id="client-id"
				name="clientId"
				type="password"
				placeholder="Enter Client Id"
				class="w-full"
			/>
		</div>
		<div>
			<Label for="client-secret" class="mb-2 block">Client Secret</Label>
			<Input
				id="client-secret"
				name="clientSecret"
				type="password"
				placeholder="Enter Client Secret"
				class="w-full"
			/>
		</div>
		<div>
			<Label for="tenant-id" class="mb-2 block">Tenant Id</Label>
			<Input
				id="tenant-id"
				name="tenantId"
				type="password"
				placeholder="Enter Tenant Id"
				class="w-full"
			/>
		</div>
	</form>
	{#snippet footer()}
		<Button type="submit" form="authConfigform">Apply</Button>
		<Button color="alternative">Cancel</Button>
	{/snippet}
</Dialog>
