<script lang="ts">
	import classroom from '$lib/assets/classroom.jpg';
	import logo from '$lib/assets/favicon.png';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import ChooseUserForm from './choose-user-form.svelte';
	import VerifyStudentForm from './verify-student-form.svelte';
	import VerifyAdministratorForm from './verify-administrator-form.svelte';
	import RegisterForm from './register-form.svelte';

	let { data, form: formResult } = $props();
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
							<h1 class="text-2xl font-bold">Create your account</h1>
							<p class="px-3 text-sm text-balance text-muted-foreground">
								{#if !formResult?.step}
									Choose your account type before signing up.
								{:else if formResult.step === 'verify-administrator'}
									Enter your given credentials to verify your account.
								{:else if formResult.step === 'verify-student'}
									Enter your LRN and given password to verify your account.
								{:else if formResult.step === 'register-administrator' || formResult.step === 'register-student'}
									Enter your email and password to register your account.
								{/if}
							</p>
						</div>
						<div class="flex flex-col gap-2 p-6 md:p-8">
							{#if !formResult?.step}
								<ChooseUserForm form={data.chooseUserTypeForm} />
							{:else if formResult.step === 'verify-administrator'}
								<VerifyAdministratorForm
									form={data.verifyAdministratorForm}
									error={formResult.error}
								/>
							{:else if formResult.step === 'verify-student'}
								<VerifyStudentForm form={data.verifyStudentForm} error={formResult.error} />
							{:else if formResult.step === 'register-administrator'}
								<RegisterForm
									form={data.registerForm}
									error={formResult.error}
									action="?/registerAdministrator"
								/>
							{:else if formResult.step === 'register-student'}
								<RegisterForm
									form={data.registerForm}
									error={formResult.error}
									action="?/registerStudent"
								/>
							{/if}

							<Field.FieldDescription class="text-center">
								Already registered your account? <a href="/login">Sign in</a>
							</Field.FieldDescription>
						</div>
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
