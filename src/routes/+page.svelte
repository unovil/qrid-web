<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	const summaryData = [
		{
			"title": "Present students",
			"color": "bg-green-500/40",
			"amount": 26
		},
		{
			"title": "Absent students",
			"color": "bg-red-500/40",
			"amount": 12
		},
		{
			"title": "Late students",
			"color": "bg-yellow-500/40",
			"amount": 2
		}
	] as Array<{title: string; color: string; amount: number}>;
</script>

<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6">
			<div class="col-span-1 sm:col-span-2 lg:col-span-3 text-center m-4">
				<h1 class="text-2xl font-bold">Good morning, user!</h1>
				<p class="text-muted-foreground">Welcome back, here's a summary of today's attendance.</p>
			</div>
			{#each summaryData as card (card.title)}
				<Card.Root class="w-full aspect-video justify-center {card.color} border-{card.color}">
					<Card.Content>
						<div class="text-4xl font-bold text-foreground w-full text-center">{card.amount}</div>
					</Card.Content>
					<Card.Header>
						<Card.Title class="text-center text-lg">{card.title}</Card.Title>
					</Card.Header>
				</Card.Root>
			{/each}
			<div>
				
			</div>
		</div>
	</div>
</div>