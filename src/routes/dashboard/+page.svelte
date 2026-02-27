<script lang="ts">
	import AttendanceCards from './attendance-cards.svelte';
	import AttendanceSummaryTable from './attendance-summary-table.svelte';
	import WarningsTable from './warnings-table.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { SummaryAttendanceLog, WarningLog } from '$lib/components/table-types';

	const attendanceLogs: {
		section: string;
		logs: SummaryAttendanceLog[];
	}[] = [
		{
			section: 'Aristotle',
			logs: [
				{ date: new Date('February 23, 2026'), present: 20, absent: 5, late: 2 },
				{ date: new Date('February 22, 2026'), present: 18, absent: 7, late: 3 },
				{ date: new Date('February 21, 2026'), present: 22, absent: 3, late: 1 },
				{ date: new Date('February 20, 2026'), present: 19, absent: 6, late: 4 },
				{ date: new Date('February 19, 2026'), present: 21, absent: 4, late: 2 }
			]
		},
		{
			section: 'Plato',
			logs: [
				{ date: new Date('February 23, 2026'), present: 25, absent: 3, late: 1 },
				{ date: new Date('February 22, 2026'), present: 24, absent: 4, late: 2 },
				{ date: new Date('February 21, 2026'), present: 26, absent: 2, late: 0 },
				{ date: new Date('February 20, 2026'), present: 23, absent: 5, late: 3 },
				{ date: new Date('February 19, 2026'), present: 27, absent: 1, late: 0 }
			]
		}
	];

	const studentWarnings: WarningLog[] = [
		{ name: 'Doe, John', section: 'Aristotle', late: 7, status: 'Community service' },
		{ name: 'Smith, Jane', section: 'Plato', late: 5, status: 'Warning note given' },
		{ name: 'Johnson, Emily', section: 'Aristotle', late: 5, status: 'Consultation with parents' },
		{ name: 'Brown, Michael', section: 'Plato', late: 4, status: 'Warning note given' },
		{ name: 'Davis, Sarah', section: 'Aristotle', late: 3, status: 'Warning note given' }
	];

	let selectedSectionIndex: string | undefined = $state(undefined);

	const triggerSectionChange = $derived(
		selectedSectionIndex === undefined
			? 'Select a section'
			: (attendanceLogs[Number(selectedSectionIndex)]?.section ?? 'Select a section')
	);
</script>

<h1 class="w-full text-center text-3xl font-semibold text-balance">
	Your attendance summary for today, February 24:
</h1>

<AttendanceCards />

<div class="flex flex-col gap-3">
	<div class="flex items-center gap-4">
		<span class="font-semibold">Select a section:</span>
		<Select.Root type="single" bind:value={selectedSectionIndex}>
			<Select.Trigger class="w-60">{triggerSectionChange}</Select.Trigger>
			<Select.Content>
				{#each attendanceLogs as section, index}
					<Select.Item value={index.toString()}>{section.section}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
	<AttendanceSummaryTable
		logs={attendanceLogs[selectedSectionIndex === undefined ? 0 : Number(selectedSectionIndex)]
			?.logs ?? []}
	/>
</div>

<div class="flex flex-col gap-3">
	<span class="font-semibold">Warnings</span>
	<WarningsTable warnings={studentWarnings} />
</div>
