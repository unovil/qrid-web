<script lang="ts">
	import type { WarningLog } from '$lib/components/table-types';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getPreviousPossibleDays } from '$lib/dates';
	import { getLocalTimeZone } from '@internationalized/date';
	import type { PageProps } from './$types';
	import AttendanceCards from './attendance-cards.svelte';
	import AttendanceSummaryTable from './attendance-summary-table.svelte';
	import WarningsTable from './warnings-table.svelte';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();

	let attendanceLogs = $derived(data.attendanceLogs || []);
	let lateStudents: WarningLog[] = $derived(data.lateStudents || []);
	let totals = $derived(
		data.totals || {
			today: { present: 0, absent: 0, late: 0 },
			yesterday: { present: 0, absent: 0, late: 0 }
		}
	);

	onMount(() => {
		console.log(attendanceLogs);
	});

	let selectedSectionIndex: string | undefined = $state(undefined);

	const triggerSectionChange = $derived(
		selectedSectionIndex === undefined
			? 'Select a section'
			: (attendanceLogs[Number(selectedSectionIndex)]?.section ?? 'Select a section')
	);
</script>

<h1 class="w-full text-center text-3xl font-semibold text-balance">
	Your attendance summary for {getPreviousPossibleDays(1)[0]
		.toDate(getLocalTimeZone())
		.toLocaleDateString('en-US', { weekday: 'long' })}:
</h1>

<AttendanceCards
	presentToday={totals.today.present}
	absentToday={totals.today.absent}
	lateToday={totals.today.late}
	presentYesterday={totals.yesterday.present}
	absentYesterday={totals.yesterday.absent}
	lateYesterday={totals.yesterday.late}
/>

<Tabs.Root value="attendance-summary" class="w-full">
	<Tabs.List class="justify-start border-b">
		<Tabs.Trigger
			class="data-[state=active]:border-b-2 data-[state=active]:border-primary"
			value="attendance-summary"
		>
			Attendance Summary
		</Tabs.Trigger>
		<Tabs.Trigger
			class="data-[state=active]:border-b-2 data-[state=active]:border-primary"
			value="late-warnings"
		>
			Late Warnings
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="attendance-summary">
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
	</Tabs.Content>
	<Tabs.Content value="late-warnings">
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-4">
				<WarningsTable warnings={lateStudents} />
			</div>
		</div>
	</Tabs.Content>
</Tabs.Root>
