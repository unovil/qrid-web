<script lang="ts">
	import type { SummaryAttendanceLog } from '$lib/components/table-types';
	import * as Table from '$lib/components/ui/table/index.js';
	let { logs = new Array<SummaryAttendanceLog>() } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-2/5">Previous Days</Table.Head>
			<Table.Head class="w-1/5">Present</Table.Head>
			<Table.Head class="w-1/5">Absent</Table.Head>
			<Table.Head class="w-1/5">Late</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each logs as log}
			<Table.Row>
				<Table.Cell
					>{log.date.toLocaleDateString('en-US', {
						weekday: 'long',
						month: 'long',
						day: 'numeric'
					})}</Table.Cell
				>
				<Table.Cell>{log.present} student{log.present !== 1 ? 's' : ''}</Table.Cell>
				<Table.Cell>{log.absent} student{log.absent !== 1 ? 's' : ''}</Table.Cell>
				<Table.Cell>{log.late} student{log.late !== 1 ? 's' : ''}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
