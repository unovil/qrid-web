<script lang="ts">
	import classroom from '$lib/assets/classroom.jpg';
	import logo from '$lib/assets/favicon.png';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { loginSchema } from '$lib/schema/loginSchema.js';
	import { Toggle } from 'bits-ui';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { EyeClosed, Eye } from '@lucide/svelte';

	let { data, form: formResult } = $props();

	let serverError = $derived(formResult?.error || null);

	const removeServerError = () => {
		serverError = null;
	};

	// Client API:
	const form = $derived(
		superForm(data.form, {
			validators: zod4Client(loginSchema),
			resetForm: true
		})
	);
	const { form: formData, enhance } = $derived(form);

	let showPassword = $state(false);

	const isFormValid = $derived(loginSchema.safeParse($formData).success);
</script>

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-3xl">
		<div class="flex flex-col gap-6">
			<Card.Root class="overflow-hidden p-0">
				<Card.Content class="grid p-0 md:grid-cols-2">
					<div>
						<div class="my-4 flex items-center justify-center gap-2">
							<img src={logo} alt="Logo" class="h-15 w-15" />
							<span class="font-mono text-3xl font-semibold">QR-ID</span>
						</div>
						<div class="flex flex-col items-center gap-2 text-center">
							<h1 class="text-2xl font-bold">Welcome back</h1>
							<p class="text-balance text-muted-foreground">Login to your QR-ID account</p>
						</div>
						<form use:enhance method="post" class="p-6 md:p-8">
							<Field.FieldGroup class="flex flex-col gap-3">
								<Form.Field {form} name="email">
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
								<Form.Field {form} name="password">
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
										<Field.FieldError class="text-sm font-medium text-destructive"
											>{serverError}</Field.FieldError
										>
									{/if}
									<Form.Button type="submit" disabled={!isFormValid}>Sign In</Form.Button>
								</div>
								<Field.FieldDescription class="text-center">
									Haven't registered your account yet? <a href="/signup">Sign up</a>
								</Field.FieldDescription>
							</Field.FieldGroup>
						</form>
					</div>
					<div class="relative hidden bg-muted md:block">
						<img
							src={classroom}
							alt="placeholder"
							class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<Field.FieldDescription class="px-6 text-center font-mono text-xs">
				By clicking continue, you agree to our <a href="##">Terms of Service</a> and
				<a href="##">Privacy Policy</a>.
			</Field.FieldDescription>
		</div>
	</div>
</div>
