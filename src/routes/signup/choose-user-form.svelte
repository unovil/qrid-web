<script lang="ts">
	import * as Field from '$lib/components/ui/field/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { chooseUserTypeSchema } from '$lib/schema/registerSchema';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { form }: { form: SuperValidated<{ userType: 'administrator' | 'student' }> } = $props();

	const chooseUserTypeForm = $derived(
		superForm(form, {
			validators: zod4Client(chooseUserTypeSchema),
			resetForm: true
		})
	);
	const { form: formData, enhance } = $derived(chooseUserTypeForm);
</script>

<form use:enhance method="post" action="?/chooseUserType" class="flex flex-col gap-3">
	<Form.Field form={chooseUserTypeForm} name="userType">
		<Form.Control>
			{#snippet children({ props })}
				<RadioGroup.Root {...props} bind:value={$formData.userType}>
					<Field.Label>
						<Field.Field orientation="horizontal">
							<div class="flex flex-row gap-2">
								<Field.Content>
									<Field.Title>I am an Administrator</Field.Title>
									<Field.Description>
										Administrators can manage records, view analytics, and export to DepEd SF2.
									</Field.Description>
								</Field.Content>
								<RadioGroup.Item value="administrator" />
							</div>
						</Field.Field>
					</Field.Label>
					<Field.Label>
						<Field.Field orientation="horizontal">
							<div class="flex flex-row gap-2">
								<Field.Content>
									<Field.Title>I am a Student</Field.Title>
									<Field.Description>
										Students can see their own records and penalties, and regenerate their QR code.
									</Field.Description>
								</Field.Content>
								<RadioGroup.Item value="student" />
							</div>
						</Field.Field>
					</Field.Label>
				</RadioGroup.Root>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Button type="submit">Next</Form.Button>
</form>
