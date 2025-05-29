<script lang="ts">
	import { onMount } from 'svelte';
	import { AppConfig } from '../../../types/config.js';

	let loading = true;
	let submitting = false;
	let error: string | null = null;
	let success = false;
</script>

<form id="authConfigform">
	<input />
</form>
