import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	return { url: url.origin };
};
