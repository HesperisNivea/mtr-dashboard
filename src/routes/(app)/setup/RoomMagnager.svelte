<script lang="ts">
	import { Button, Input, Label } from 'flowbite-svelte';
</script>

<div class="w-full">
	<h2 class="text-2xl font-semibold text-gray-900">Room Management</h2>
	<p class="mt-2 text-sm text-gray-600">Manage your rooms and their configurations here.</p>
	<div>
		<form class="flex items-end gap-2">
			<div class="flex-1">
				<Label>Meeting Room email:</Label>
				<Input type="email" placeholder="Enter Meeting Room email" class="mt-2 w-full" required />
			</div>
			<Button type="submit" class="mt-2">Add Room</Button>
		</form>
	</div>
	<div class="mt-4">
		<!-- Placeholder for room management content -->
		<p class="text-sm text-gray-600">List of rooms will be displayed here.</p>
	</div>
</div>
