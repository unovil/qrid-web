<script lang="ts">
	import AttendanceCalendar from '$lib/components/attendance-calendar.svelte';
	import type { CalendarCellLog } from '$lib/components/table-types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index';
	import {
		isLastSchoolDay,
		isDateDisabled,
		isFirstSchoolDay,
		isWeekend,
		isHoliday,
		getHolidayName
	} from '$lib/dates';
	import {
		getLocalTimeZone,
		isWeekday,
		Time,
		today,
		type DateValue
	} from '@internationalized/date';
	import {
		CalendarDays,
		ChevronLeft,
		ChevronRight,
		CircleCheck,
		CircleX,
		ClockAlert,
		CalendarOff
	} from '@lucide/svelte';

	let selectedDate: DateValue | undefined = $state(today(getLocalTimeZone()));

	let { days }: { days: CalendarCellLog } = $props();

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

	let cardInfo = $derived.by(() => {
		if (!selectedDate) return null;
		const log = days[selectedDate.toString()];
		if (!log) return null;
		return {
			status: log.status,
			time: log.timestamp ? formatTime12h(log.timestamp) : 'No timestamp recorded',
			icon: log.status === 'Present' ? CircleCheck : log.status === 'Absent' ? CircleX : ClockAlert,
			gradient:
				log.status === 'Present'
					? 'from-green-100'
					: log.status === 'Absent'
						? 'from-red-100'
						: 'from-yellow-100',
			textColor:
				log.status === 'Present'
					? 'text-green-900'
					: log.status === 'Absent'
						? 'text-red-900'
						: 'text-yellow-900'
		};
	});

	const resolvedCard = $derived.by(() => {
		if (selectedDate === undefined)
			return {
				status: 'No data',
				icon: CircleX,
				gradient: 'from-gray-100',
				textColor: 'text-gray-900',
				time: 'No timestamp recorded'
			};

		if (cardInfo)
			return {
				status: cardInfo.status,
				icon: cardInfo.icon,
				gradient: cardInfo.gradient,
				textColor: cardInfo.textColor,
				time: cardInfo.time
			};

		if (selectedDate && !isDateDisabled(selectedDate))
			return {
				status: 'Absent',
				icon: CircleX,
				gradient: 'from-red-100',
				textColor: 'text-red-900',
				time: 'No timestamp recorded'
			};

		if (isHoliday(selectedDate))
			return {
				status: getHolidayName(selectedDate) ?? 'Holiday',
				icon: CalendarOff,
				gradient: 'from-gray-100',
				textColor: 'text-gray-900',
				time: 'No timestamp recorded'
			};

		return null;
	});
</script>

<div class="flex w-full flex-col gap-10 md:flex-row">
	<div class="flex justify-center md:justify-start">
		<AttendanceCalendar
			type="single"
			bind:value={selectedDate}
			class="inline-block w-fit rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
			attendance={days}
			{isDateDisabled}
		/>
	</div>

	<!-- center using grid with padding -->
	<div class="my-auto grid flex-1 p-10 text-start md:my-auto">
		{#if resolvedCard && selectedDate}
			<Card.Root
				class={`@container/card bg-linear-to-t ${resolvedCard.gradient} to-card shadow-xs`}
			>
				<Card.Header class="items-center">
					<Card.Description class={`font-semibold ${resolvedCard.textColor}`}>
						Information
					</Card.Description>

					<Card.Title
						class={`flex items-center gap-2 text-4xl font-semibold ${resolvedCard.textColor} tabular-nums @[250px]/card:text-5xl`}
					>
						<resolvedCard.icon class="size-12" />
						{resolvedCard.status}
					</Card.Title>

					<Card.Action class="justify-center">
						<Badge variant="outline">
							<CalendarDays />
							{selectedDate
								? `${selectedDate.month}/${selectedDate.day}/${selectedDate.year}`
								: 'No date selected'}
						</Badge>
					</Card.Action>
				</Card.Header>

				<Card.Content class="h-auto text-lg">
					<span class="font-semibold">Attendance time:</span>
					<span class="font-mono">{resolvedCard.time}</span>
				</Card.Content>

				<Card.Footer>
					<div class="grid w-full grid-cols-2 gap-2 text-sm">
						<Button
							variant="outline"
							onclick={() => {
								if (!selectedDate) return;

								let days = 1;
								while (isWeekend(selectedDate.subtract({ days }))) days++;
								selectedDate = selectedDate.subtract({ days });
							}}
							disabled={isFirstSchoolDay(selectedDate)}
						>
							<span class="flex items-center gap-2">
								<ChevronLeft />
								<span>Previous Day</span>
							</span>
						</Button>

						<Button
							variant="outline"
							onclick={() => {
								if (!selectedDate) return;

								let days = 1;
								while (isWeekend(selectedDate.add({ days }))) days++;
								selectedDate = selectedDate.add({ days });
							}}
							disabled={isLastSchoolDay(selectedDate)}
						>
							<span class="flex items-center gap-2">
								<span>Next Day</span>
								<ChevronRight />
							</span>
						</Button>
					</div>
				</Card.Footer>
			</Card.Root>
		{/if}
	</div>
</div>
