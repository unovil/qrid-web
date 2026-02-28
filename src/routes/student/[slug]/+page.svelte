<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import type { CalendarCellLog } from '$lib/components/table-types';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import {
		CalendarDate,
		getLocalTimeZone,
		Time,
		today,
		type DateValue
	} from '@internationalized/date';
	import CalendarView from './calendar-view.svelte';

	let selectedDate: DateValue | undefined = $state(today(getLocalTimeZone()));

	function formatDateLong(dateStr: string): string {
		const [year, month, day] = dateStr.split('-').map(Number);
		const date = new CalendarDate(year, month, day);

		return date.toDate('UTC').toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

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

	const days: CalendarCellLog = {
		[new CalendarDate(2026, 2, 5).toString()]: {
			timestamp: new Time(6, 15, 30),
			status: 'Present'
		},
		[new CalendarDate(2026, 2, 8).toString()]: {
			timestamp: new Time(6, 10, 15),
			status: 'Present'
		},
		[new CalendarDate(2026, 2, 10).toString()]: {
			timestamp: null,
			status: 'Absent'
		},
		[new CalendarDate(2026, 2, 12).toString()]: {
			timestamp: new Time(7, 30, 0),
			status: 'Late'
		}
	};
</script>

<div class="flex w-full flex-col justify-between gap-3">
	<h1 class="w-full text-4xl font-bold">Student Attendance Profile</h1>

	<div class="flex items-start gap-2 text-left">
		<img src={favicon} alt="Student" class="h-24 w-auto rounded-lg bg-gray-300 object-cover" />

		<table class="border-separate border-spacing-x-4 border-spacing-y-1">
			<tbody>
				<tr>
					<th class="text-left font-medium whitespace-nowrap">Name:</th>
					<td class="text-left">Doe, John</td>
				</tr>
				<tr>
					<th class="text-left font-medium whitespace-nowrap">Section:</th>
					<td class="text-left">7 - Aristotle</td>
				</tr>
				<tr>
					<th class="text-left font-medium whitespace-nowrap">Student ID:</th>
					<td class="text-left font-mono">123456789789</td>
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
	<Tabs.Content value="calendar">
		<CalendarView {days} />
	</Tabs.Content>
	<Tabs.Content value="records">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-1/2">Date</Table.Head>
					<Table.Head class="w-1/4">Status</Table.Head>
					<Table.Head class="w-1/4">Timestamp</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each Object.entries(days).reverse() as [date, log]}
					{@const bgColor =
						log.status === 'Present'
							? 'bg-green-200'
							: log.status === 'Absent'
								? 'bg-red-200'
								: 'bg-yellow-200'}
					<Table.Row class={bgColor}>
						<Table.Cell>{formatDateLong(date)}</Table.Cell>
						<Table.Cell>{log.status}</Table.Cell>
						<Table.Cell class="font-mono">{formatTime12h(log.timestamp)}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="text-center">No attendance records found.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Tabs.Content>
</Tabs.Root>
