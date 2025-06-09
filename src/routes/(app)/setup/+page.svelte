<script lang="ts">
	import { enhance } from '$app/forms';
	import Dialog from '$lib/components/Dialog.svelte';
	import { Button, Label, Input } from 'flowbite-svelte';
	//import { AppConfig } from '../../../types/config.js';

	let loading = true;
	let submitting = false;
	let error: string | null = null;
	let success = false;
	let dialog = $state<HTMLDialogElement>();
	let isOpen = $state(true);
	let defaultModal = $state(false);

	const handleOnClose = () => {
		dialog?.close();
	};

	function handleSubmit() {
		// Add your form submission logic here
		alert('Form submitted!');
	}
</script>

<div>
	<p>This is the setup page. You can configure your application settings here.</p>
</div>

<Button
	onclick={() => {
		dialog?.showModal();
	}}
	class="mb-4"
>
	Open Dialog
</Button>

<Dialog bind:dialog onClose={handleOnClose} class="bg-blue rounded p-4 shadow-lg">
	<form
		id="authConfigform"
		method="POST"
		action="?/login"
		use:enhance={handleSubmit}
		class="flex flex-col gap-4 px-6 py-4"
	>
		<div class="mb-6">
			<Label for="client-id" class="mb-2 block">Client Id</Label>
			<Input
				id="client-id"
				name="clientId"
				type="password"
				placeholder="Enter Client Id"
				class="w-full"
			/>
		</div>
		<div class="mb-6">
			<Label for="client-secret" class="mb-2 block">Client Secret</Label>
			<Input
				id="client-secret"
				name="clientSecret"
				type="password"
				placeholder="Enter Client Secret"
				class="w-full"
			/>
		</div>
		<div class="mb-6">
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
		<Button form="authConfigform">I accept</Button>
		<Button color="alternative">Decline</Button>
	{/snippet}
</Dialog>
