<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';

	let visible = $state(false);
	let timeout: ReturnType<typeof setTimeout>;

	const showNavbar = () => {
		visible = true;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			visible = false;
		}, 1500);
	};

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('mousemove', showNavbar);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', showNavbar);
			clearTimeout(timeout);
		}
	});

	let { children } = $props();
</script>

<nav class="absolute z-10 w-full bg-gray-800 p-4 shadow-md {visible ? 'visible' : 'hidden'}">
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
		<div class=" space-x-6 md:flex">
			<a href="/" class="text-gray-100 transition hover:text-white">Dashboard</a>

			<a href="/setup" class="text-gray-100 transition hover:text-white">Setup</a>
		</div>
	</div>
</nav>
<div class="h-screen bg-gray-50">
	{@render children()}
</div>

<style>
	nav {
		transition: opacity 0.3s ease-in-out;
	}

	.visible {
		opacity: 1;
		pointer-events: auto;
	}

	.hidden {
		opacity: 0;
	}
</style>
