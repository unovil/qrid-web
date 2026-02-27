<script lang="ts">
	import type { WarningLog } from '$lib/components/table-types';
	import * as Table from '$lib/components/ui/table/index.js';
	let { warnings = new Array<WarningLog>() } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-1/4">Student Name</Table.Head>
			<Table.Head class="w-1/4">Section</Table.Head>
			<Table.Head class="w-1/4">Late Records this quarter</Table.Head>
			<Table.Head class="w-1/4">Status</Table.Head>
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
