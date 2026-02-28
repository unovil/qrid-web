<script lang="ts">
	import AttendanceCalendar from '$lib/components/attendance-calendar.svelte';
	import type { CalendarCellLog } from '$lib/components/table-types';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index';
	import { cn } from '$lib/utils';
	import {
		CalendarDate,
		getLocalTimeZone,
		Time,
		today,
		ZonedDateTime,
		type DateValue
	} from '@internationalized/date';
	import {
		CalendarDays,
		ChevronLeft,
		ChevronRight,
		CircleCheck,
		CircleX,
		ClockAlert
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
</script>

<div class="flex w-full gap-10">
	<AttendanceCalendar
		type="single"
		bind:value={selectedDate}
		class="inline-block rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
		attendance={days}
	/>

	<!-- center using grid with padding -->
	<div class="my-auto grid flex-1 p-10 text-start">
		{#if cardInfo}
			<Card.Root class={`@container/card bg-linear-to-t ${cardInfo.gradient} to-card shadow-xs`}>
				<Card.Header class="items-center">
					<Card.Description class={`font-semibold ${cardInfo.textColor}`}>
						Information
					</Card.Description>

					<Card.Title
						class={`flex items-center gap-2 text-4xl font-semibold ${cardInfo.textColor} tabular-nums @[250px]/card:text-5xl`}
					>
						<cardInfo.icon class="size-12" />
						{cardInfo.status}
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
					<span class="font-mono">{cardInfo.time}</span>
				</Card.Content>

				<Card.Footer>
					<div class="grid w-full grid-cols-2 gap-2 text-sm">
						<Button
							variant="outline"
							onclick={() => {
								selectedDate = selectedDate ? selectedDate.subtract({ days: 1 }) : undefined;
							}}
						>
							<span class="flex items-center gap-2">
								<ChevronLeft />
								<span>Previous Day</span>
							</span>
						</Button>
						<Button
							variant="outline"
							onclick={() => {
								selectedDate = selectedDate ? selectedDate.add({ days: 1 }) : undefined;
							}}
						>
							<span class="flex items-center gap-2">
								<span>Next Day</span>
								<ChevronRight />
							</span>
						</Button>
					</div>
				</Card.Footer>
			</Card.Root>
		{:else}
			<Card.Root class="@container/card bg-linear-to-t from-gray-100 to-card shadow-xs">
				<Card.Header class="items-center">
					<Card.Description class="font-semibold text-gray-900">Information</Card.Description>

					<Card.Title
						class="flex items-center gap-2 text-4xl font-semibold text-gray-900 tabular-nums @[250px]/card:text-5xl"
					>
						<CircleX class="size-12" />
						No data
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
					<span class="font-mono">No timestamp recorded</span>
				</Card.Content>

				<Card.Footer>
					<div class="grid w-full grid-cols-2 gap-2 text-sm">
						<Button
							variant="outline"
							onclick={() => {
								selectedDate = selectedDate ? selectedDate.subtract({ days: 1 }) : undefined;
							}}
						>
							<span class="flex items-center gap-2">
								<ChevronLeft />
								<span>Previous Day</span>
							</span>
						</Button>
						<Button
							variant="outline"
							onclick={() => {
								selectedDate = selectedDate ? selectedDate.add({ days: 1 }) : undefined;
							}}
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
