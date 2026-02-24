<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	let {
		warnings
	}: {
		warnings: {
			name: string;
			section: string;
			late: number;
			status: string;
		}[];
	} = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Student Name</Table.Head>
			<Table.Head>Section</Table.Head>
			<Table.Head>Late Records this quarter</Table.Head>
			<Table.Head>Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each warnings as warning}
			<Table.Row>
				<Table.Cell>{warning.name}</Table.Cell>
				<Table.Cell>{warning.section}</Table.Cell>
				<Table.Cell>{warning.late} late record{warning.late !== 1 ? 's' : ''}</Table.Cell>
				<Table.Cell>{warning.status}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
