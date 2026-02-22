import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	return { url: url.origin };
};

export const actions: Actions = {
	default: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Error signing out:', error);
			return { error: 'An error occurred while trying to log out. Please try again.' };
		}

		redirect(302, '/login');
	}
};
