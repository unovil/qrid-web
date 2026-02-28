<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select';
	import {
		getDayOfWeek,
		getLocalTimeZone,
		today,
		CalendarDate,
		type DateValue
	} from '@internationalized/date';
	import { ChevronDownIcon } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import AttendanceSection from './attendance-section.svelte';

	const id = $props.id();

	let open = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	let { data }: PageProps = $props();
	const { attendanceLogs } = $derived(data);

	let selectedSectionIndex: string | undefined = $state(undefined);

	const isDateDisabled = (date: DateValue) => {
		// disable weekends
		const dayOfWeek = getDayOfWeek(date, 'en-US');
		return dayOfWeek === 0 || dayOfWeek === 6;
	};
</script>

<h1 class="w-full text-center text-3xl font-semibold text-balance">
	Find your sections' records here:
</h1>

<div
	class="flex w-full flex-col items-center justify-center gap-4 *:flex *:flex-col *:gap-3 @xl/main:flex-row"
>
	<div>
		<Label for="date-select" class="px-1">Date</Label>
		<Popover.Root bind:open>
			<Popover.Trigger id="date-select">
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="w-48 justify-between font-normal">
						{calendarValue
							? calendarValue.toDate(getLocalTimeZone()).toLocaleDateString()
							: 'Select date'}
						<ChevronDownIcon />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="start">
				<Calendar
					type="single"
					bind:value={calendarValue}
					captionLayout="dropdown"
					maxValue={today(getLocalTimeZone())}
					{isDateDisabled}
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div>
		<Label for="section-select" class="px-1">Section</Label>
		<Select.Root type="single" bind:value={selectedSectionIndex}>
			<Select.Trigger id="section-select" class="w-48">
				{selectedSectionIndex !== undefined
					? attendanceLogs[0].logs[Number(selectedSectionIndex)].section
					: 'Select a section'}
			</Select.Trigger>
			<Select.Content>
				{#each attendanceLogs[0].logs as log, index}
					<Select.Item value={index.toString()}>{log.section}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>

{#if calendarValue !== undefined && selectedSectionIndex !== undefined}
	{@const dateIso = calendarValue.toString()}
	{@const dayLog = attendanceLogs.find((a) => a.date.toISOString().split('T')[0] === dateIso)}
	{#if dayLog}
		{@const sectionLog = dayLog.logs[Number(selectedSectionIndex)]}
		{#if sectionLog}
			<AttendanceSection
				maleLogs={sectionLog.studentDataMale}
				femaleLogs={sectionLog.studentDataFemale}
			/>
		{:else}
			<AttendanceSection maleLogs={[]} femaleLogs={[]} />
		{/if}
	{:else}
		<AttendanceSection maleLogs={[]} femaleLogs={[]} />
	{/if}
{:else}
	<AttendanceSection maleLogs={[]} femaleLogs={[]} />
{/if}
