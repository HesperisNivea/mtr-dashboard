<script lang="ts">
	export let title: string = 'Subject test policy';
	export let startTime: string = '21:00';
	export let endTime: string = '23:00';

	// Create an array of 12 elements for iteration
	const items = Array.from({ length: 12 });
</script>

<ul class="space-y-0.5">
	{#each items as _, i}
		<li class="flex h-[120px] flex-col rounded-lg border border-gray-300 bg-white p-6 shadow-md">
			<div class="flex items-center space-x-4">
				<p class="time text-lg text-gray-500">{startTime} - {endTime}</p>
				<p class="location text-lg text-red-700"></p>
			</div>
			<p class="text-2xl font-semibold">{title}</p>
		</li>
	{/each}
	<li
		class="flex h-[90px] flex-col justify-center rounded-lg border border-gray-300 bg-white px-6 shadow-md"
	>
		<div class="flex flex-row items-center gap-4">
			<p class="time text-lg text-gray-500">{startTime} - {endTime}</p>
			<p class="text-xl text-gray-800">{title}</p>
		</div>
	</li>
	<li class="flex h-[60px] flex-col rounded-lg border border-gray-300 bg-white px-4 shadow-md">
		<div class="flex flex-row gap-4">
			<div>
				<p class="text-lg text-gray-700">{title}</p>
			</div>
			<div>
				<p class="time text-lg text-gray-500">{startTime} - {endTime}</p>
			</div>
		</div>
	</li>
</ul>

<style>
	.title {
		font-style: normal;
		font-size: 1.5rem; /* Increased for better visibility */
		font-weight: 500;
		color: #333;
	}
	.time {
		height: auto;
		width: auto;
		font-weight: 600;
		font-size: 1rem; /* Adjusted for 4K screens */
	}
</style>
