<script lang="ts">
	import { verifyAdministratorSchema } from '$lib/schema/registerSchema.js';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import SuperDebugRuned from 'sveltekit-superforms/SuperDebug.svelte';

	let { form }: { form: SuperValidated<{ userType: 'administrator' | 'student' }> } = $props();

	const verifyAdministratorForm = $derived(
		superForm(form, {
			validators: zod4Client(verifyAdministratorSchema),
			resetForm: true
		})
	);
	const { form: formData, enhance } = $derived(verifyAdministratorForm);
</script>

<SuperDebugRuned data={$formData} />
