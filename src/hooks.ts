import { deLocalizeUrl } from '$lib/paraglide/runtime';
import { parseZonedDateTime, ZonedDateTime } from '@internationalized/date';
import type { Transport } from '@sveltejs/kit';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;

export const transport: Transport = {
	ZonedDateTime: {
		encode: (value) => value instanceof ZonedDateTime && [value.toString()],
		decode: ([value]) => parseZonedDateTime(value)
	}
};
