<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';
	import type { ClassValue } from 'tailwind-variants';
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../routes/signup/$types';

	interface Props {
		class?: ClassValue | null;
		ref?: HTMLElement | null;
		action?: string | null;
		form?: ActionData;
	}

	let { ref = $bindable(null), class: className, action, form: formData }: Props = $props();
	const id = $props.id();
</script>

<form
	method="POST"
	use:enhance
	class={cn('flex flex-col gap-6', className)}
	{action}
	bind:this={ref}
>
	<div class="flex flex-col items-center gap-2 text-center">
		<div class="flex items-center gap-2 small-caps">
			<span class="font-bold">Verify</span>
			<span class="text-slate-400">&gt;</span>
			<span class="text-slate-400">Sign up</span>
			<span class="text-slate-400">&gt;</span>
			<span class="text-slate-400">Confirm</span>
		</div>
		<h1 class="text-2xl font-bold font-serif">Verify your credentials</h1>
		<p class="text-muted-foreground text-balance text-sm">
			Enter your given domain, ID and password below to create your QR-ID account.
		</p>
	</div>

	{#if formData?.id === 'verify' && !formData?.success}
		{#if formData?.alreadyRegistered === true}
			<p class="text-red-500 text-sm font-bold">
				This ID is already registered. Please try again with a different ID.
			</p>
		{:else if formData?.userNotFound === true}
			<p class="text-red-500 text-sm font-bold">
				No user was found with the provided domain, domain ID and password. Please check your
				inputs.
			</p>
		{/if}
	{/if}

	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-3">
			<Label for="domain-{id}">Domain</Label>
			<Input name="domain" id="domain-{id}" type="text" placeholder="ex. school.org" required />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="domainid-{id}">Domain ID</Label>
			<Input name="domainId" id="domainid-{id}" type="text" placeholder="ex. grade7" required />
		</div>

		<div class="flex flex-col gap-3">
			<Label for="password-{id}">Password</Label>
			<Input
				id="password-{id}"
				name="password"
				placeholder="Enter your given password here"
				type="password"
				required
			/>
		</div>

		<Button type="submit" class="w-full">Verify!</Button>
	</div>
</form>
