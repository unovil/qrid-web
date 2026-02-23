<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input';
	import { verifyStudentSchema } from '$lib/schema/registerSchema.js';
	import { Eye, EyeClosed } from '@lucide/svelte';
	import { Toggle } from 'bits-ui';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let {
		form,
		error
	}: {
		form: SuperValidated<{
			userType: 'administrator' | 'student';
			lrn: string;
			password: string;
		}>;
		error: string | null;
	} = $props();

	const verifyStudentForm = $derived(
		superForm(form, {
			validators: zod4Client(verifyStudentSchema),
			resetForm: true
		})
	);

	const { form: formData, enhance } = $derived(verifyStudentForm);

	let serverError = $derived(error || null);

	const removeServerError = () => {
		serverError = null;
	};

	$formData.userType = 'student';

	let showPassword = $state(false);
</script>

<form use:enhance method="post" action="?/verifyStudent" class="flex flex-col gap-3">
	<Form.Field form={verifyStudentForm} name="lrn">
		<Form.Control>
			{#snippet children({ props })}
				<Field.Label>LRN</Field.Label>
				<Input
					{...props}
					bind:value={$formData.lrn}
					oninput={removeServerError}
					type="text"
					placeholder="123456789012"
					required
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={verifyStudentForm} name="password">
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
