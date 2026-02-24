<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	let {
		logs
	}: {
		logs: {
			date: Date;
			present: number;
			absent: number;
			late: number;
		}[];
	} = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Previous Days</Table.Head>
			<Table.Head>Present</Table.Head>
			<Table.Head>Absent</Table.Head>
			<Table.Head>Late</Table.Head>
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
