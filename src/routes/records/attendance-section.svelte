<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SectionAttendanceRowLog } from '$lib/components/table-types';
	import * as Table from '$lib/components/ui/table/index.js';
	let {
		maleLogs = new Array<SectionAttendanceRowLog>(),
		femaleLogs = new Array<SectionAttendanceRowLog>()
	} = $props();
</script>

<div class="flex flex-col gap-4">
	<h2>Male</h2>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-1/33">#</Table.Head>
				<Table.Head class="w-8/33">Name</Table.Head>
				<Table.Head class="w-8/33">LRN</Table.Head>
				<Table.Head class="w-8/33">Status</Table.Head>
				<Table.Head class="w-8/33">Timestamp</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each maleLogs as log, index}
				{@const bgColor =
					log.status === 'Present'
						? 'bg-green-200'
						: log.status === 'Absent'
							? 'bg-red-200'
							: 'bg-yellow-200'}
				<Table.Row onclick={() => goto(`/student/${log.lrn}`)} class="cursor-pointer {bgColor}">
					<Table.Cell>{index + 1}</Table.Cell>
					<Table.Cell>{log.name}</Table.Cell>
					<Table.Cell class="font-mono">{log.lrn}</Table.Cell>
					<Table.Cell>{log.status}</Table.Cell>
					<Table.Cell>{log.timestamp}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={5} class="text-center">No attendance records found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<h2>Female</h2>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-1/33">#</Table.Head>
				<Table.Head class="w-8/33">Name</Table.Head>
				<Table.Head class="w-8/33">LRN</Table.Head>
				<Table.Head class="w-8/33">Status</Table.Head>
				<Table.Head class="w-8/33">Timestamp</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each femaleLogs as log, index}
				{@const bgColor =
					log.status === 'Present'
						? 'bg-green-200'
						: log.status === 'Absent'
							? 'bg-red-200'
							: 'bg-yellow-200'}
				<Table.Row onclick={() => goto(`/student/${log.lrn}`)} class="cursor-pointer">
					<Table.Cell>{index + 1}</Table.Cell>
					<Table.Cell>{log.name}</Table.Cell>
					<Table.Cell class="font-mono">{log.lrn}</Table.Cell>
					<Table.Cell>{log.status}</Table.Cell>
					<Table.Cell>{log.timestamp}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={5} class="text-center">No attendance records found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
