import logo from '$lib/assets/favicon.png';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		logo: logo
	};
};
