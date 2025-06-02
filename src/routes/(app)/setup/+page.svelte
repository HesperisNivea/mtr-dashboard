<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import { onMount } from 'svelte';
	//import { AppConfig } from '../../../types/config.js';

	let loading = true;
	let submitting = false;
	let error: string | null = null;
	let success = false;
	let dialog = $state<HTMLDialogElement>();

	const handleOnClose = () => {
		dialog?.close();
	};
</script>

<Dialog bind:dialog onClose={handleOnClose} class="bg-blue rounded p-4 shadow-lg">
	<!-- Dialog content goes here -->
	<form id="authConfigform">
		<label for="clintId">Client Id</label>
		<input id="clientId" type="password" />
		<label for="clientSecret">Client Secret</label>
		<input id="clientSecret" type="password" />
		<label for="tenantId">Tenant ID</label>
		<input id="tenantId" type="password" />
	</form>
</Dialog>
