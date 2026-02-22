<script lang="ts">
	import {
		registerAdministratorSchema,
		registerStudentSchema
	} from '$lib/schema/registerSchema.js';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { form }: { form: SuperValidated<{ userType: 'administrator' | 'student' }> } = $props();

	const registerAdministratorForm = $derived(
		superForm(form, {
			validators: zod4Client(registerAdministratorSchema),
			resetForm: true
		})
	);
	const { form: registerAdministratorFormData, enhance: enhanceRegisterAdministratorForm } =
		$derived(registerAdministratorForm);

	const registerStudentForm = $derived(
		superForm(form, {
			validators: zod4Client(registerStudentSchema),
			resetForm: true
		})
	);
	const { form: registerStudentFormData, enhance: enhanceRegisterStudentForm } =
		$derived(registerStudentForm);
</script>
