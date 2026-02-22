<script lang="ts">
	import classroom from '$lib/assets/classroom.jpg';
	import logo from '$lib/assets/favicon.png';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import ChooseUserForm from './choose-user-form.svelte';

	let { data } = $props();

	let serverError = $derived(null);
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
							<p class="text-sm text-balance text-muted-foreground">
								Choose your account type before signing up.
							</p>
						</div>
						<div class="flex flex-col gap-2 p-6 md:p-8">
							<ChooseUserForm form={data.chooseUserTypeForm} />
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
