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
			<span class="font-bold">Sign up</span>
			<span class="text-slate-400">&gt;</span>
			<span class="text-slate-400">Confirm</span>
		</div>
		<h1 class="text-2xl font-bold font-serif">Create your account</h1>
		<p class="text-muted-foreground text-balance text-sm">
			You can now enter a new email and password to create your QR-ID account.
		</p>
	</div>

	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<Label for="email-{id}">Email</Label>
			<Input id="email-{id}" type="email" placeholder="ex. j.delacruz@gmail.com" required />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="password-{id}">Password</Label>
			<Input
				id="password-{id}"
				placeholder="Enter your new password here"
				type="password"
				required
			/>
		</div>

		<div class="flex gap-3">
			<Button type="button" class="flex-1" variant="outline" onclick={onback}>Back</Button>
			<Button type="submit" class="flex-1">Create!</Button>
		</div>
	</div>
</form>
