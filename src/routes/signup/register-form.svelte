<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { passwordValidators, registerSchema } from '$lib/schema/registerSchema.js';
	import { Eye, EyeClosed, CircleCheck, CircleX } from '@lucide/svelte';
	import { Toggle } from 'bits-ui';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let {
		form,
		action,
		error
	}: {
		form: SuperValidated<{
			email: string;
			password: string;
			confirmPassword: string;
		}>;
		error: string | null;
		action: '?/registerAdministrator' | '?/registerStudent';
	} = $props();

	let serverError = $derived(error || null);

	const removeServerError = () => {
		serverError = null;
	};

	const registerForm = $derived(
		superForm(form, {
			validators: zod4Client(registerSchema),
			resetForm: true
		})
	);

	const { form: formData, enhance } = $derived(registerForm);

	let showPassword = $state(false);

	const passwordStatus = $derived(
		passwordValidators.map((rule) => ({
			label: rule.label,
			test: rule.test($formData.password)
		}))
	);

	const confirmPasswordStatus = $derived({
		label: 'Passwords match',
		test: $formData.password.length > 0 && $formData.confirmPassword === $formData.password
	});

	const isFormValid = $derived(registerSchema.safeParse($formData).success);
</script>

<form use:enhance method="post" {action}>
	<Field.FieldGroup class="flex flex-col gap-3">
		<Form.Field form={registerForm} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Field.Label>Email</Field.Label>
					<Input
						{...props}
						bind:value={$formData.email}
						oninput={removeServerError}
						type="email"
						placeholder="m@example.com"
						required
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={registerForm} name="password">
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
			<Field.FieldDescription>
				{#each passwordStatus as rule}
					<div class="flex items-center gap-2">
						{#if rule.test}
							<CircleCheck class="size-5 text-green-500" />
							<span class="text-green-600">{rule.label}</span>
						{:else}
							<CircleX class="size-5 text-muted-foreground" />
							<span class="text-muted-foreground">{rule.label}</span>
						{/if}
					</div>
				{/each}
			</Field.FieldDescription>
		</Form.Field>
		<Form.Field form={registerForm} name="confirmPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Field.Label>Confirm your password</Field.Label>
					<div class="flex flex-row">
						<Input
							{...props}
							bind:value={$formData.confirmPassword}
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
			<Field.FieldDescription>
				<div class="flex items-center gap-2">
					{#if confirmPasswordStatus.test}
						<CircleCheck class="size-5 text-green-500" />
						<span class="text-green-600">{confirmPasswordStatus.label}</span>
					{:else}
						<CircleX class="size-5 text-muted-foreground" />
						<span class="text-muted-foreground">{confirmPasswordStatus.label}</span>
					{/if}
				</div>
			</Field.FieldDescription>
		</Form.Field>
		<div class="flex flex-col gap-2 text-center">
			{#if serverError}
				<Field.FieldError class="text-sm font-medium text-destructive"
					>{serverError}</Field.FieldError
				>
			{/if}
			<Form.Button type="submit" disabled={!isFormValid}>Sign Up</Form.Button>
		</div>
	</Field.FieldGroup>
</form>
