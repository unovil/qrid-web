import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	chooseUserTypeSchema,
	registerAdministratorSchema,
	registerStudentSchema,
	verifyAdministratorSchema,
	verifyStudentSchema
} from '$lib/schema/registerSchema';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(302, '/dashboard');
	}

	const chooseUserTypeForm = await superValidate(zod4(chooseUserTypeSchema));
	const verifyAdministratorForm = await superValidate(zod4(verifyAdministratorSchema));
	const verifyStudentForm = await superValidate(zod4(verifyStudentSchema));
	const registerStudentForm = await superValidate(zod4(registerStudentSchema));
	const registerAdministratorForm = await superValidate(zod4(registerAdministratorSchema));

	return {
		chooseUserTypeForm,
		verifyAdministratorForm,
		verifyStudentForm,
		registerStudentForm,
		registerAdministratorForm,
		url: url.origin
	};
};

export const actions = {
	chooseUserType: async (event) => {
		const form = await superValidate(event, zod4(chooseUserTypeSchema));
		if (!form.valid) {
			return { form, error: 'Please select a user type.' };
		}

		console.log('User type selected:', form.data.userType);
		return { form };
	},
	verifyStudent: async (event) => {
		const form = await superValidate(event, zod4(verifyStudentSchema));
	}
} satisfies Actions;
