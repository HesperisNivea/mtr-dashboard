<script lang="ts">
	import MsGraphConfigModal from './MsGraphConfigModal.svelte';
</script>

<div>
	<p>This is the setup page. You can configure your application settings here.</p>
</div>

<MsGraphConfigModal
	onSuccess={() => {
		// Handle success, e.g., show a notification or update the UI
		console.log('Configuration successful');
	}}
/>
