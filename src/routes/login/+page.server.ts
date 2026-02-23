import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/schema/loginSchema';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		redirect(302, '/dashboard');
	}

	const form = await superValidate(zod4(loginSchema));

	return {
		form,
		url: url.origin
	};
};

export const actions = {
	default: async (event) => {
		console.log('Login action triggered.');
		const {
			locals: { supabase }
		} = event;

		const form = await superValidate(event, zod4(loginSchema));
		console.log(form);
		if (!form.valid) {
			console.log('Form supervalidation failed.', form.errors);
			return fail(400, { form, error: 'Please fill in all fields correctly.' });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		let errorMessage: string | null = null;

		if (error) {
			switch (error?.code) {
				case 'invalid_credentials':
					errorMessage = 'Invalid email or password.';
					break;
				case 'request_timeout':
					errorMessage = 'The request timed out. Please try again.';
					break;
				default:
					errorMessage = error?.message || 'An unexpected error occurred. Please try again.';
					break;
			}

			return fail(400, { form, error: errorMessage });
		}

		await supabase.auth.signOut({ scope: 'others' });
		redirect(302, '/dashboard');
	}
} satisfies Actions;
