<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';
	import type { ClassValue } from 'tailwind-variants';

	interface Props {
		class?: ClassValue | null;
		ref?: HTMLElement | null;
		action?: string | null;
		onback?: (e: MouseEvent) => void;
	}

	let { ref = $bindable(null), class: className, action, onback }: Props = $props();
	const id = $props.id();
</script>

<form class={cn('flex flex-col gap-6', className)} bind:this={ref} {action}>
	<div class="flex flex-col items-center gap-2 text-center">
		<div class="flex items-center gap-2 small-caps">
			<span>Verify</span>
			<span>&gt;</span>
			<span>Sign up</span>
			<span>&gt;</span>
			<span class="font-bold">Confirm</span>
		</div>
		<h1 class="text-2xl font-bold font-serif">Confirm your details</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Check your details below to finalize your account creation.
		</p>
	</div>

	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<Label for="domain-confirm-{id}">Domain</Label>
			<Input id="domain-confirm-{id}" type="text" placeholder="Domain here" required disabled />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="domain-id-confirm-{id}">Domain ID</Label>
			<Input
				id="domain-id-confirm-{id}"
				type="text"
				placeholder="Domain ID here"
				required
				disabled
			/>
		</div>

		<div class="flex flex-col gap-3">
			<Label for="email-confirm-{id}">Email</Label>
			<Input id="email-{id}" type="email" placeholder="New email here" required disabled />
		</div>

		<div class="flex gap-3">
			<Button type="button" class="flex-1" variant="outline" onclick={onback}>Back</Button>
			<Button type="submit" class="flex-1">Sign up!</Button>
		</div>
	</div>
</form>
