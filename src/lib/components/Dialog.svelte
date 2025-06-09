<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		dialog?: HTMLDialogElement;
		open?: boolean;
		class?: string;
		onClose: () => void;
		title?: Snippet;
		footer?: Snippet;
		children: Snippet;
		confirmText?: string;
		cancelText?: string;
		onConfirm?: () => void;
		id?: string;
	};

	let {
		dialog = $bindable(),
		class: className = '',
		open = false,
		onClose,
		title,
		children,
		footer,
		id = crypto.randomUUID()
	}: Props = $props();

	let dialogCss = `fixed z-50 ${className}`;

	$effect(() => {
		if (dialog) {
			dialog.className = dialogCss;
			if (open) {
				dialog.showModal();
			} else {
				dialog.close();
			}
		}
	});
</script>

<dialog
	bind:this={dialog}
	onclose={onClose}
	{id}
	class="m-0 h-full w-full bg-transparent p-0 shadow-none"
>
	<!-- Backdrop -->
	<div class="fixed inset-0 bg-black/50" aria-hidden="true"></div>

	<!-- Dialog Container -->sdfkls;
	<div class="fixed inset-0 flex items-center justify-center p-4">
		<!-- Dialog Content Box -->
		<div class="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl">
			<!-- Header -->
			<div
				class="flex items-center bg-gray-50 px-8 py-4 sm:px-6 {title == null
					? 'justify-end'
					: 'justify-between'}"
			>
				{#if title}
					<h3 class="font-semibold text-gray-900">
						{@render title?.()}
					</h3>
				{/if}
				<button type="button" class="text-gray-400 hover:text-gray-500" onclick={onClose}>
					<span class="sr-only">Close</span>
					<svg
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			<!-- Body -->
			<div class="p-6">
				{@render children()}
			</div>
			{#if footer}
				<!-- Footer -->
				<div class="flex flex-col gap-2 bg-gray-50 px-8 py-4 sm:flex-row-reverse sm:px-6">
					{@render footer?.()}
				</div>
			{/if}
		</div>
	</div>
</dialog>

<style>
	/* Dialog styling */
	dialog {
		position: fixed;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		overflow: hidden;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 640px) {
		dialog .flex-col {
			flex-direction: column;
		}

		dialog button {
			width: 100%;
		}
	}
</style>
