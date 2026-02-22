import { z } from 'zod';

export const chooseUserTypeSchema = z.object({
	userType: z.enum(['administrator', 'student'])
});

export type ChooseUserTypeSchema = typeof chooseUserTypeSchema;

export const verifyAdministratorSchema = chooseUserTypeSchema.extend({
	domain: z.string(),
	domainId: z.string(),
	password: z.string()
});

export type VerifyAdministratorSchema = typeof verifyAdministratorSchema;

export const verifyStudentSchema = chooseUserTypeSchema.extend({
	lrn: z.string().regex(/^\d{12}$/, 'LRN must be exactly 12 digits long'),
	password: z.string()
});

export type VerifyStudentSchema = typeof verifyStudentSchema;

export const registerStudentSchema = verifyStudentSchema.extend({
	email: z.email(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/\d/, 'Password must contain at least one number')
		.regex(
			/[@$!%*?&]/,
			'Password must contain at least one special character (@, $, !, %, *, ?, &)'
		)
});

export const registerAdministratorSchema = verifyAdministratorSchema.extend({
	email: z.email(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/\d/, 'Password must contain at least one number')
		.regex(
			/[@$!%*?&]/,
			'Password must contain at least one special character (@, $, !, %, *, ?, &)'
		)
});

export type RegisterStudentSchema = typeof registerStudentSchema;
export type RegisterAdministratorSchema = typeof registerAdministratorSchema;
