import { db } from '$lib/supabase';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import { sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types.d.ts';
import { signUpSchema, verifySchema } from './schema.ts';

export const load: PageServerLoad = async () => {
	return {
		verifyForm: await superValidate(zod4(verifySchema)),
		signUpForm: await superValidate(zod4(signUpSchema))
	};
};

export const actions = {
	verify: async ({ request }) => {
		const verifyForm = await superValidate(request, zod4(verifySchema));

		console.log(verifyForm.data);

		// verify allowed user with domain, domain id and password
		const { status, hashedPassword } = (
			await db.execute(sql`SELECT get_allowed_user_json(
				${verifyForm.data.domain}, 
				${verifyForm.data.domainId}
			);`)
		)[0]['get_allowed_user_json'] as { status: number; hashedPassword: string | null };

		console.log(`status: ${status}, hashedPassword: ${hashedPassword}`);

		if (status === 0) {
			// user is already registered, throw error
			return fail(401, { id: 'verify', alreadyRegistered: true });
		} else if (status === -1) {
			// user does not exist, throw error
			return fail(401, { id: 'verify', userNotFound: true });
		}

		const isPasswordVerified = await argon2.verify(
			hashedPassword as string,
			verifyForm.data.password
		);

		if (isPasswordVerified === false) {
			// password is incorrect, throw error
			return fail(401, { id: 'verify', userNotFound: true });
		}

		return { id: 'verify', success: true };
	},

	create: async (event) => {},

	confirm: async (event) => {}
} satisfies Actions;
