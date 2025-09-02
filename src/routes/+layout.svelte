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

<nav class="absolute z-10 w-full bg-slate-600 p-4 shadow-md {visible ? 'visible' : 'hidden'}">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center space-x-3">
			<!-- Logo placeholder -->
			<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white">
				<!-- Replace with your logo -->
				<span class="text-xl font-bold text-slate-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-6"
					>
						<path
							fill-rule="evenodd"
							d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</div>
			<!-- Company name -->
			<span class="text-xl font-semibold text-white">MTR Dashboard</span>
		</div>

		<!-- Navigation links -->
		<div class=" space-x-6 md:flex">
			<a href="/" class="text-gray-100 transition hover:text-blue-200">Dashboard</a>

			<a href="/setup" class="text-gray-100 transition hover:text-blue-200">Setup</a>
		</div>
	</div>
</nav>
<div class="h-screen bg-slate-300">
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
