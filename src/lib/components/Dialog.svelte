<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		dialog?: HTMLDialogElement;
		open?: boolean;
		class?: string;
		onClose: () => void;
		backButton?: Snippet;
		title?: Snippet;
		footer?: Snippet;
		children: Snippet;
		id?: string;
	};

	let {
		dialog = $bindable(),
		class: className = '',
		open = false,
		onClose,
		backButton,
		title,
		children,
		footer,
		id = crypto.randomUUID()
	}: Props = $props();

	let dialogCss = `w-full max-w-2xl rounded-xl font-normal text-base bg-surface-1 shadow-md overflow-hidden ${className}`;

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

<dialog bind:this={dialog} class={className} onclose={onClose} {id}>
	<div class="relative flex flex-col justify-between rounded-md pb-8 pt-10">
		<p>test</p>
	</div>
</dialog>

<!-- <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
		<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
			<div class="sm:flex sm:items-start">
				<div
					class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
				>
					<svg
						class="size-6 text-red-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
						></path>
					</svg>
				</div>
				<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
					<h3 class="text-base font-semibold text-gray-900" id="modal-title">Deactivate account</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-500">
							Are you sure you want to deactivate your account? All of your data will be permanently
							removed. This action cannot be undone.
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
			<button
				type="button"
				class="shadow-xs inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
				@click="open = false">Deactivate</button
			>
			<button
				type="button"
				class="shadow-xs mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
				@click="open = false">Cancel</button
			>
		</div>
	</div>
</div> -->
