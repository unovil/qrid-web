<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	const summaryData = [
		{
			title: 'Present students',
			color: 'bg-green-500/40',
			amount: 26
		},
		{
			title: 'Absent students',
			color: 'bg-red-500/40',
			amount: 12
		},
		{
			title: 'Late students',
			color: 'bg-yellow-500/40',
			amount: 2
		}
	] as Array<{ title: string; color: string; amount: number }>;
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
			<div class="col-span-1 m-4 text-center sm:col-span-2 lg:col-span-3">
				<h1 class="text-2xl font-bold">Good morning, user!</h1>
				<p class="text-muted-foreground">Welcome back, here's a summary of today's attendance.</p>
			</div>
			{#each summaryData as card (card.title)}
				<Card.Root class="aspect-video w-full justify-center {card.color} border-{card.color}">
					<Card.Content>
						<div class="w-full text-center text-4xl font-bold text-foreground">{card.amount}</div>
					</Card.Content>
					<Card.Header>
						<Card.Title class="text-center text-lg">{card.title}</Card.Title>
					</Card.Header>
				</Card.Root>
			{/each}
			<div></div>
		</div>
	</div>
</div>
