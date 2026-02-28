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
	import { goto, invalidate } from '$app/navigation';

	const id = $props.id();

	let open = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	let { data }: PageProps = $props();
	const { sections } = $derived(data);
	let { attendanceLogs } = $derived(data);

	let selectedSectionId: string = $state('');

	const isDateDisabled = (date: DateValue) => {
		// disable weekends
		const dayOfWeek = getDayOfWeek(date, 'en-US');
		return dayOfWeek === 0 || dayOfWeek === 6;
	};

	let lastKey = $state('');

	$effect(() => {
		if (!calendarValue || !selectedSectionId) return;

		const date = calendarValue.toString();
		const key = `${date}:${selectedSectionId}`;

		if (key === lastKey) return;
		lastKey = key;

		console.log(
			'Selected date and sectionId changed - date:',
			date,
			'sectionId:',
			selectedSectionId
		);

		goto(`/records?date=${date}&sectionId=${selectedSectionId}`, { replaceState: true });
	});
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
					onValueChange={() => (open = false)}
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div>
		<Label for="section-select" class="px-1">Section</Label>
		<Select.Root type="single" bind:value={selectedSectionId}>
			<Select.Trigger id="section-select" class="w-48">
				{#if selectedSectionId !== ''}
					{@const selectedSection = sections.find((s) => s.id.toString() === selectedSectionId)}
					{selectedSection
						? `${selectedSection.level} - ${selectedSection.section}`
						: 'Select a section'}
				{:else}
					Select a section
				{/if}
			</Select.Trigger>
			<Select.Content>
				{#each sections as section}
					<Select.Item value={section.id.toString()}
						>{`${section.level} - ${section.section}`}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>

{#if attendanceLogs}
	<AttendanceSection
		maleLogs={attendanceLogs
			.filter((log) => log.sex === 'MALE')
			.sort((a, b) => a.name.localeCompare(b.name))}
		femaleLogs={attendanceLogs
			.filter((log) => log.sex === 'FEMALE')
			.sort((a, b) => a.name.localeCompare(b.name))}
	/>
{:else}
	<AttendanceSection maleLogs={[]} femaleLogs={[]} />
{/if}
