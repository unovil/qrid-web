import { redirect, type Actions } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { session, user } = await safeGetSession();

	const email = user?.email;
	let name = '';
	let schoolName = '';
	if (user?.user_metadata['admin_user_id']) {
		const adminRequest = await supabase.from('admin_users').select('name').limit(1).single();
		if (adminRequest.data) {
			name = adminRequest.data.name;
		}

		const schoolRequest = await supabase.from('schools').select('name').limit(1).single();
		if (schoolRequest.data) {
			schoolName = schoolRequest.data.name;
		}
	}

	return {
		session,
		user,
		email,
		name,
		schoolName,
		cookies: cookies.getAll()
	};
};
