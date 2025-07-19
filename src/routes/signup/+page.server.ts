import { db } from '$lib/supabase';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import * as argon2 from 'argon2';

export const actions = {
	verify: async ({ cookies, request }) => {
		const formData = await request.formData();
		console.log(Object.fromEntries(formData.entries()));

		// verify allowed user with domain, domain id and password
		const { status, hashedPassword } = (
			await db.execute(sql`SELECT get_allowed_user_json(
            ${formData.get('domain')}, 
            ${formData.get('domainId')}
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
			formData.get('password') as string
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
