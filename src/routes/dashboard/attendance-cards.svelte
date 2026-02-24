<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { CalendarDays, CircleCheck, CircleX, ClockAlert } from '@lucide/svelte';

	let {
		presentToday = 0,
		absentToday = 0,
		lateToday = 0,
		presentYesterday = 0,
		absentYesterday = 0,
		lateYesterday = 0
	} = $props();

	const compareDays = (today: number, yesterday: number) => {
		if (today > yesterday) return 'More than';
		if (today < yesterday) return 'Less than';
		return 'Same as';
	};
</script>

<div
	class="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3"
>
	<Card.Root class="@container/card from-green-100 to-card">
		<Card.Header>
			<Card.Description class="inline-flex items-center gap-1 font-semibold text-green-900">
				<CircleCheck size="20" />
				Present
			</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{presentToday} student{presentToday !== 1 ? 's' : ''}
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<CalendarDays />
					Feb 24
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{compareDays(presentToday, presentYesterday)} previous school day
			</div>
			<div class="text-muted-foreground">
				Previously: {presentYesterday} student{presentYesterday !== 1 ? 's' : ''}
			</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card from-red-100 to-card">
		<Card.Header>
			<Card.Description class="inline-flex items-center gap-1 font-semibold text-red-900">
				<CircleX size="20" />
				Absent
			</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{absentToday} student{absentToday !== 1 ? 's' : ''}
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<CalendarDays />
					Feb 24
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{compareDays(absentToday, absentYesterday)} previous school day
			</div>
			<div class="text-muted-foreground">
				Previously: {absentYesterday} student{absentYesterday !== 1 ? 's' : ''}
			</div>
		</Card.Footer>
	</Card.Root>
	<Card.Root class="@container/card from-yellow-100 to-card">
		<Card.Header>
			<Card.Description class="inline-flex items-center gap-1 font-semibold text-yellow-900">
				<ClockAlert size="20" />
				Late
			</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
				{lateToday} student{lateToday !== 1 ? 's' : ''}
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<CalendarDays />
					Feb 24
				</Badge>
			</Card.Action>
		</Card.Header>
		<Card.Footer class="flex-col items-start gap-1.5 text-sm">
			<div class="line-clamp-1 flex gap-2 font-medium">
				{compareDays(lateToday, lateYesterday)} previous school day
			</div>
			<div class="text-muted-foreground">
				Previously: {lateYesterday} student{lateYesterday !== 1 ? 's' : ''}
			</div>
		</Card.Footer>
	</Card.Root>
</div>
