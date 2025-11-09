<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';
	import type { ClassValue } from 'tailwind-variants';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	interface Props {
		class?: ClassValue | null;
		ref?: HTMLElement | null;
		action?: string | null;
		onback?: (e: MouseEvent) => void;
		form?: ActionData;
	}

	let { ref = $bindable(null), class: className, action, onback, form: formData }: Props = $props();
	const id = $props.id();
</script>

<form
	use:enhance
	class={cn('flex flex-col gap-6', className)}
	method="POST"
	bind:this={ref}
	{action}
>
	<div class="flex flex-col items-center gap-2 text-center">
		<div class="small-caps flex items-center gap-2">
			<span>Verify</span>
			<span>&gt;</span>
			<span class="font-bold">Sign up</span>
			<span class="text-slate-400">&gt;</span>
			<span class="text-slate-400">Confirm</span>
		</div>
		<h1 class="font-serif text-2xl font-bold">Create your account</h1>
		<p class="text-sm text-balance text-muted-foreground">
			You can now enter a new email and password to create your QR-ID account.
		</p>
	</div>

	{#if formData?.id === 'signup' && !formData?.success}
		{#if formData?.alreadyRegistered === true}
			<p class="text-sm font-bold text-red-500">
				This ID is already registered. Please try again with a different ID.
			</p>
		{:else if formData?.userNotFound === true}
			<p class="text-sm font-bold text-red-500">
				No user was found with the provided domain, domain ID and password. Please check your
				inputs.
			</p>
		{/if}
	{/if}

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
