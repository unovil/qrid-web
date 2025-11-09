<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import { verifySchema, type VerifySchema } from './schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { cn } from '$lib/utils.js';
	import type { ClassValue } from 'tailwind-variants';
	import type { ActionData } from './$types';

	let {
		data,
		action
	}: {
		data: { verifyForm: SuperValidated<Infer<VerifySchema>> };
		action?: string | null;
	} = $props();

	const form = superForm(data.verifyForm, {
		validators: zod4Client(verifySchema)
	});

	const { form: formData, errors: formErrors, enhance } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-6" {action}>
	<div class="flex flex-col items-center gap-2 text-center">
		<div class="small-caps flex items-center gap-2">
			<span class="font-bold">Verify</span>
			<span class="text-slate-400">&gt;</span>
			<span class="text-slate-400">Sign up</span>
			<span class="text-slate-400">&gt;</span>
			<span class="text-slate-400">Confirm</span>
		</div>
		<h1 class="font-serif text-2xl font-bold">Verify your credentials</h1>
		<p class="text-sm text-balance text-muted-foreground">
			Enter your given domain, ID and password below to create your QR-ID account.
		</p>
	</div>

	<!-- {#if formData?.id === 'verify' && !formData?.success}
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
	{/if} -->

	<div class="flex flex-col gap-3">
		<Form.Field {form} name="domain">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Domain</Form.Label>
					<Input {...props} bind:value={$formData.domain} />
				{/snippet}
			</Form.Control>
			{#if $formErrors.domain}
				<Form.FieldErrors />
			{:else}
				<p class="min-h-4 text-xs text-muted-foreground">Please enter the domain given to you.</p>
			{/if}
		</Form.Field>

		<Form.Field {form} name="domainId">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Domain ID</Form.Label>
					<Input {...props} bind:value={$formData.domainId} />
				{/snippet}
			</Form.Control>
			{#if $formErrors.domainId}
				<Form.FieldErrors />
			{:else}
				<p class="min-h-4 text-xs text-muted-foreground">
					Please enter the domain ID given to you.
				</p>
			{/if}
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} type="password" bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			{#if $formErrors.password}
				<Form.FieldErrors />
			{:else}
				<p class="min-h-4 text-xs text-muted-foreground">Please enter the password given to you.</p>
			{/if}
		</Form.Field>
	</div>

	<Form.Button>Verify!</Form.Button>
</form>
