import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	chooseUserTypeSchema,
	registerSchema,
	verifyAdministratorSchema,
	verifyStudentSchema
} from '$lib/schema/registerSchema';
import type { Database } from '$lib/supabase/database';
import { verify } from 'argon2';

type GetStudentUserJsonArgs = Database['public']['Functions']['get_student_user_json']['Args'];
type GetAdminUserJsonArgs = Database['public']['Functions']['get_admin_user_json']['Args'];
type GetUserJsonReturn = {
	status: number | null;
	hashedPassword: string | null;
};

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(302, '/dashboard');
	}

	const chooseUserTypeForm = await superValidate(zod4(chooseUserTypeSchema));
	const verifyAdministratorForm = await superValidate(zod4(verifyAdministratorSchema));
	const verifyStudentForm = await superValidate(zod4(verifyStudentSchema));
	const registerForm = await superValidate(zod4(registerSchema));

	return {
		chooseUserTypeForm,
		verifyAdministratorForm,
		verifyStudentForm,
		registerForm,
		url: url.origin
	};
};

export const actions = {
	chooseUserType: async (event) => {
		const form = await superValidate(event, zod4(chooseUserTypeSchema));
		if (!form.valid) {
			return fail(400, { form, error: 'Please select a user type.' });
		}

		console.log('User type selected:', form.data.userType);

		return {
			step: form.data.userType === 'administrator' ? 'verify-administrator' : 'verify-student',
			error: null,
			form
		};
	},
	verifyStudent: async (event) => {
		const {
			locals: { supabase }
		} = event;
		const form = await superValidate(event, zod4(verifyStudentSchema));
		if (!form.valid) {
			return fail(400, {
				form,
				step: 'verify-student',
				error: 'Please enter the correct information.'
			});
		}

		const { data, error } = await supabase.rpc('get_student_user_json', {
			lrn: Number(form.data.lrn)
		} satisfies GetStudentUserJsonArgs);

		if (error) {
			return fail(400, {
				form,
				step: 'verify-student',
				error: error.message || 'An error occurred while verifying your information.'
			});
		}

		// transform data (JSON) into a usable format
		const { status, hashedPassword } = data as GetUserJsonReturn;

		switch (status) {
			case -1:
				return fail(400, {
					form,
					step: 'verify-student',
					error: 'No accounts were found with these credentials.'
				});
			case 0:
				return fail(400, {
					form,
					step: 'verify-student',
					error: 'These credentials have already been registered.'
				});
			case null:
				return fail(400, {
					form,
					step: 'verify-student',
					error: 'An error occurred while verifying your information.'
				});
		}

		if (!(await verify(hashedPassword || '', form.data.password))) {
			return fail(400, { form, step: 'verify-student', error: 'Incorrect password.' });
		}

		return {
			step: 'register-student',
			id: status,
			error: null,
			form
		};
	},
	verifyAdmin: async (event) => {
		const {
			locals: { supabase }
		} = event;
		const form = await superValidate(event, zod4(verifyAdministratorSchema));
		if (!form.valid) {
			return fail(400, {
				form,
				step: 'verify-administrator',
				error: 'Please enter the correct information.'
			});
		}

		const { data, error } = await supabase.rpc('get_admin_user_json', {
			domain: form.data.domain,
			org_id: form.data.domainId
		} satisfies GetAdminUserJsonArgs);

		if (error) {
			return fail(400, {
				form,
				step: 'verify-administrator',
				error: error.message || 'An error occurred while verifying your information.'
			});
		}

		// transform data (JSON) into a usable format
		const { status, hashedPassword } = data as GetUserJsonReturn;

		switch (status) {
			case -1:
				return fail(400, {
					form,
					step: 'verify-administrator',
					error: 'No accounts were found with these credentials.'
				});
			case 0:
				return fail(400, {
					form,
					step: 'verify-administrator',
					error: 'These credentials have already been registered.'
				});
			case null:
				return fail(400, {
					form,
					step: 'verify-administrator',
					error: 'An error occurred while verifying your information.'
				});
		}

		if (!(await verify(hashedPassword || '', form.data.password))) {
			return fail(400, { form, step: 'verify-administrator', error: 'Incorrect password.' });
		}

		return {
			step: 'register-administrator',
			id: status,
			error: null,
			form
		};
	}
} satisfies Actions;
