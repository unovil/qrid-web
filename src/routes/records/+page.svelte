<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { ChevronDownIcon } from '@lucide/svelte';
	import {
		getDayOfWeek,
		getLocalTimeZone,
		today,
		type CalendarDate,
		type DateValue
	} from '@internationalized/date';
	import AttendanceSection from './attendance-section.svelte';

	const id = $props.id();

	let open = $state(false);
	let calendarValue = $state<CalendarDate | undefined>();

	const attendanceLogs = [
		{
			date: new Date('February 23, 2026'),
			logs: [
				{
					section: 'Aristotle',
					studentData: [
						{ name: 'Doe, John', lrn: 123456789789, timestamp: '6:55:15 AM', status: 'Present' },
						{ name: 'Smith, Jane', lrn: 987654321987, timestamp: '-', status: 'Absent' },
						{ name: 'Johnson, Emily', lrn: 456789123456, timestamp: '7:05:30 AM', status: 'Late' },
						{
							name: 'Brown, Michael',
							lrn: 321654987321,
							timestamp: '6:30:01 AM',
							status: 'Present'
						},
						{ name: 'Davis, Sarah', lrn: 654321987654, timestamp: '6:35:04 AM', status: 'Present' }
					]
				}
			]
		}
	];

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
		<Label for="{id}-date" class="px-1">Date of birth</Label>
		<Popover.Root bind:open>
			<Popover.Trigger id="{id}-date">
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
					{isDateDisabled}
					type="single"
					bind:value={calendarValue}
					captionLayout="dropdown"
					onValueChange={() => {
						open = false;
					}}
					maxValue={today(getLocalTimeZone())}
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div>
		<Label for="{id}-section" class="px-1">Section</Label>
		<Select.Root type="single" bind:value={selectedSectionIndex}>
			<Select.Trigger id="{id}-section" class="w-48">Select a section</Select.Trigger>
			<Select.Content>
				<Select.Item value="0">Aristotle</Select.Item>
				<Select.Item value="1">Plato</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>

<AttendanceSection maleLogs={attendanceLogs[0].logs[0].studentData} femaleLogs={[]} />
