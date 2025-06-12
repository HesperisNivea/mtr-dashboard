<script lang="ts">
	import MsGraphConfigModal from './MsGraphConfigModal.svelte';
	import { Button } from 'flowbite-svelte';
</script>

<div>
	<p>This is the setup page. You can configure your application settings here.</p>
</div>

<div>
	<!-- select with multiple checks to add new rums -->

	<!-- input to add manually a new room -->
</div>

<MsGraphConfigModal
	onSuccess={() => {
		// Handle success, e.g., show a notification or update the UI
		console.log('Configuration successful');
	}}
/>
