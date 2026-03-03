<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import type { CalendarCellLog } from '$lib/components/table-types';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { getPreviousPossibleDays, getReversedQuarterDays, type Quarter } from '$lib/dates';
	import {
		CalendarDate,
		getLocalTimeZone,
		Time,
		toCalendarDate,
		today,
		type DateValue
	} from '@internationalized/date';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import CalendarView from './calendar-view.svelte';
	import * as Select from '$lib/components/ui/select';

	let selectedDate: DateValue | undefined = $state(today(getLocalTimeZone()));
	let dataLoading = $state(true);

	let { data }: PageProps = $props();
	let { student, attendances, avatar } = $derived(data);

	let imageSrc = $state('');

	function checkImageExists(url: string): Promise<boolean> {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => resolve(true);
			img.onerror = () => resolve(false);
			img.src = url;
		});
	}

	function formatDateLong(dateStr: string): string {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new CalendarDate(year, month, day);

		return date.toDate('UTC').toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	let selectedQuarter = $state<Quarter>('4th Quarter');

	function formatTime12h(time: Time | null): string {
		if (!time) return '—';

		let hours = time.hour;
		const minutes = time.minute.toString().padStart(2, '0');
		const seconds = time.second?.toString().padStart(2, '0') ?? '00';

		const period = hours >= 12 ? 'PM' : 'AM';

		hours = hours % 12;
		if (hours === 0) hours = 12;

		return `${hours}:${minutes}:${seconds} ${period}`;
	}

	const days: CalendarCellLog = {};

	onMount(async () => {
		dataLoading = true;
		imageSrc = (await checkImageExists(avatar)) ? avatar : favicon;
		console.log(attendances);
		for (const a of attendances) {
			const time = new Time(a.timestamp.hour, a.timestamp.minute, a.timestamp.second);
			days[toCalendarDate(a.timestamp).toString()] = {
				timestamp: time,
				status: time.compare(new Time(7, 0, 0)) < 0 ? 'Present' : 'Late'
			};
		}
		console.log(days);
		dataLoading = false;
	});
</script>

<div class="flex w-full flex-col justify-between gap-3">
	<h1 class="w-full text-4xl font-bold">Student Attendance Profile</h1>

	<div class="flex items-start gap-2 text-left">
		<img src={imageSrc} alt="Student" class="h-24 w-auto rounded-lg bg-gray-300 object-cover" />

		<table class="border-separate border-spacing-x-4 border-spacing-y-1">
			<tbody>
				<tr>
					<th class="text-left font-medium whitespace-nowrap">Name:</th>
					<td class="text-left"
						>{student?.last_name}, {student?.first_name} {student?.middle_name}</td
					>
				</tr>
				<tr>
					<th class="text-left font-medium whitespace-nowrap">Section:</th>
					<td class="text-left">{student?.sections.level} - {student?.sections.section}</td>
				</tr>
				<tr>
					<th class="text-left font-medium whitespace-nowrap">Student ID:</th>
					<td class="text-left font-mono">{student?.id}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<Tabs.Root value="calendar">
	<Tabs.List>
		<Tabs.Trigger value="calendar">Calendar</Tabs.Trigger>
		<Tabs.Trigger value="records">Records</Tabs.Trigger>
	</Tabs.List>
	{#if !dataLoading}
		<Tabs.Content value="calendar">
			<CalendarView {days} />
		</Tabs.Content>
		<Tabs.Content value="records">
			<div class="flex items-center">
				<span class="mr-4 font-semibold">Select a quarter:</span>
				<Select.Root type="single" bind:value={selectedQuarter}>
					<Select.Trigger class="w-60">{selectedQuarter}</Select.Trigger>
					<Select.Content>
						<Select.Item value={'4th Quarter' as Quarter}>{'4th Quarter' as Quarter}</Select.Item>
						<Select.Item value={'3rd Quarter' as Quarter}>{'3rd Quarter' as Quarter}</Select.Item>
						<Select.Item value={'2nd Quarter' as Quarter}>{'2nd Quarter' as Quarter}</Select.Item>
						<Select.Item value={'1st Quarter' as Quarter}>{'1st Quarter' as Quarter}</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-1/2">Date</Table.Head>
						<Table.Head class="w-1/4">Status</Table.Head>
						<Table.Head class="w-1/4">Timestamp</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each getReversedQuarterDays(selectedQuarter).map((date) => date.toString()) as date}
						{@const log = days[date]}
						{#if log}
							{@const bgColor = log.status === 'Present' ? 'bg-green-200' : 'bg-yellow-200'}
							<Table.Row class={bgColor}>
								<Table.Cell>{formatDateLong(date)}</Table.Cell>
								<Table.Cell>{log.status}</Table.Cell>
								<Table.Cell class="font-mono">{formatTime12h(log.timestamp)}</Table.Cell>
							</Table.Row>
						{:else}
							<Table.Row class="bg-red-200">
								<Table.Cell>{formatDateLong(date)}</Table.Cell>
								<Table.Cell>Absent</Table.Cell>
								<Table.Cell class="font-mono">-</Table.Cell>
							</Table.Row>
						{/if}
					{/each}
				</Table.Body>
			</Table.Root>
		</Tabs.Content>
	{/if}
</Tabs.Root>
