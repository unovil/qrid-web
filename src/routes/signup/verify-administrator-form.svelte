<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import { verifyAdministratorSchema } from '$lib/schema/registerSchema.js';
	import { Eye, EyeClosed } from '@lucide/svelte';
	import { Toggle } from 'bits-ui';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import SuperDebugRuned from 'sveltekit-superforms/SuperDebug.svelte';

	let {
		form,
		error
	}: {
		form: SuperValidated<{
			userType: 'administrator' | 'student';
			domain: string;
			domainId: string;
			password: string;
		}>;
		error: string | null;
	} = $props();

	const verifyAdministratorForm = $derived(
		superForm(form, {
			validators: zod4Client(verifyAdministratorSchema),
			resetForm: true
		})
	);
	const { form: formData, enhance } = $derived(verifyAdministratorForm);
	$formData.userType = 'administrator';

	let serverError = $derived(error || null);

	const removeServerError = () => {
		serverError = null;
	};

	let showPassword = $state(false);
</script>

<SuperDebugRuned data={$formData} />

<form use:enhance method="post" action="?/verifyAdmin" class="flex flex-col gap-6">
	<Form.Field form={verifyAdministratorForm} name="domain">
		<Form.Control>
			{#snippet children({ props })}
				<Field.Label>Domain</Field.Label>
				<Input
					{...props}
					bind:value={$formData.domain}
					oninput={removeServerError}
					type="text"
					required
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={verifyAdministratorForm} name="domainId">
		<Form.Control>
			{#snippet children({ props })}
				<Field.Label>Domain ID</Field.Label>
				<Input
					{...props}
					bind:value={$formData.domainId}
					oninput={removeServerError}
					type="text"
					required
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={verifyAdministratorForm} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Field.Label>Password</Field.Label>
				<div class="flex flex-row">
					<Input
						{...props}
						bind:value={$formData.password}
						oninput={removeServerError}
						type={showPassword ? 'text' : 'password'}
						required
					/>
					<Toggle.Root class="px-3" bind:pressed={showPassword}>
						{#if showPassword}
							<Eye class="size-5" />
						{:else}
							<EyeClosed class="size-5" />
						{/if}
					</Toggle.Root>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="flex flex-col gap-2 text-center">
		{#if serverError}
			<Field.FieldError class="text-sm font-medium text-destructive">{serverError}</Field.FieldError
			>
		{/if}
		<Form.Button type="submit">Verify</Form.Button>
	</div>
</form>
