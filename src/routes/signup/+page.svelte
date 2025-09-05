<script lang="ts">
	import ConfirmForm from './ConfirmForm.svelte';
	import SignUpForm from './SignupForm.svelte';
	import VerifyForm from './VerifyForm.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
	type authStages = 'verify' | 'signup' | 'confirm';
	let authStep = $derived.by(() => {
		if (form?.id === 'verify' && form?.success === true) return 'signup';
		if (form?.id === 'signup' && form?.success === true) return 'confirm';
		if (form?.id === 'confirm') return 'confirm';
		return 'verify'; // Default to verify if no form data
	}) as authStages;

	// $inspect(authStep).with(console.trace);
</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="bg-muted relative hidden lg:block">
		<img class="absolute inset-0 w-full h-full object-cover" src="/testimage.jpg" alt="test" />
	</div>
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<img src="/favicon.png" alt="logo" class="size-11" />
			<a href="/" class="flex items-center gap-2 font-medium text-2xl font-serif"> QR-ID </a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs px-4">
				{#if authStep === 'verify'}
					<VerifyForm action="?/verify" {form} />
				{:else if authStep === 'signup'}
					<SignUpForm action="/signup?/create" onback={() => (authStep = 'verify')} />
				{:else if authStep === 'confirm'}
					<ConfirmForm action="/signup?/confirm" onback={() => (authStep = 'signup')} />
				{/if}
			</div>
		</div>
	</div>
</div>
