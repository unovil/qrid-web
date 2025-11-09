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
			<span>Sign up</span>
			<span>&gt;</span>
			<span class="font-bold">Confirm</span>
		</div>
		<h1 class="font-serif text-2xl font-bold">Confirm your details</h1>
		<p class="text-sm text-balance text-muted-foreground">
			Check your details below to finalize your account creation.
		</p>
	</div>

	{#if formData?.id === 'confirm' && !formData?.success}
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
