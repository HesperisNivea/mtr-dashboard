<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav class="bg-gray-800 p-4 shadow-md">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<!-- Logo placeholder -->
			<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white">
				<!-- Replace with your logo -->
				<span class="text-xl font-bold text-gray-800">L</span>
			</div>
			<!-- Company name -->
			<span class="text-xl font-semibold text-white">Company Name</span>
		</div>

		<!-- Optional: Navigation links -->
		<div class="hidden space-x-6 md:flex">
			<a href="/" class="text-gray-300 transition hover:text-white">Dashboard</a>
			<a href="/meetings" class="text-gray-300 transition hover:text-white">Meetings</a>
			<a href="/settings" class="text-gray-300 transition hover:text-white">Settings</a>
			<a href="/setup" class="text-gray-300 transition hover:text-white">Setup</a>
		</div>
	</div>
</nav>
<div class="h-screen bg-gray-50 p-8 px-4">
	{@render children()}
</div>
