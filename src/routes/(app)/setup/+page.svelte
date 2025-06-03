<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import { onMount } from 'svelte';
	//import { AppConfig } from '../../../types/config.js';

	let loading = true;
	let submitting = false;
	let error: string | null = null;
	let success = false;
	let dialog = $state<HTMLDialogElement>();
	let isOpen = $state(true)
	

	const handleOnClose = () => {
		dialog?.close();
	};
</script>

<!-- <Dialog bind:dialog onClose={handleOnClose} class="bg-blue rounded p-4 shadow-lg">
	<form id="authConfigform">
		<label for="clintId">Client Id</label>
		<input id="clientId" type="password" />
		<label for="clientSecret">Client Secret</label>
		<input id="clientSecret" type="password" />
		<label for="tenantId">Tenant ID</label>
		<input id="tenantId" type="password" />
	</form>
</Dialog> -->

<div>
	<p>This is the setup page. You can configure your application settings here.</p>
</div>
<Dialog 
  open={isOpen} 
  onClose={() => isOpen = false}>
  {#snippet title()}
	<p>Deactivate account</p>
  {/snippet}
    <p class="text-sm text-gray-500">
      Are you sure you want to deactivate your account? All of your data will be permanently
      removed. This action cannot be undone.
    </p>
	  {#snippet footer()}
		<button class="btn btn-primary" onclick={() => isOpen = false}>Cancel</button>
		<button class="btn btn-danger" onclick={() => {
			isOpen = false;
			// Handle confirmation logic here
		}}>Deactivate</button>
	  {/snippet}
</Dialog>