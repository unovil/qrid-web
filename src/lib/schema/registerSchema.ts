import { z } from 'zod';

export const chooseUserTypeSchema = z.object({
	userType: z.enum(['administrator', 'student'])
});

export type ChooseUserTypeSchema = typeof chooseUserTypeSchema;

export const verifyAdministratorSchema = chooseUserTypeSchema.extend({
	domain: z.string().nonempty('Domain is required'),
	domainId: z.string().nonempty('Domain ID is required'),
	password: z.string().nonempty('Password is required')
});

export type VerifyAdministratorSchema = typeof verifyAdministratorSchema;

export const verifyStudentSchema = chooseUserTypeSchema.extend({
	lrn: z.string().regex(/^\d{12}$/, 'LRN must be exactly 12 digits long'),
	password: z.string().nonempty('Password is required')
});

export type VerifyStudentSchema = typeof verifyStudentSchema;

export const registerSchema = z
	.object({
		email: z.email(),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/\d/, 'Password must contain at least one number')
			.regex(
				/[@$!%*?&+]/,
				'Password must contain at least one special character (@, $, !, %, *, ?, &)'
			),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords don't match.",
		path: ['confirmPassword']
	});

export const passwordValidators = [
	{
		label: 'At least 8 characters',
		test: (v: string) => v.length >= 8
	},
	{
		label: 'Contains an uppercase letter',
		test: (v: string) => /[A-Z]/.test(v)
	},
	{
		label: 'Contains a lowercase letter',
		test: (v: string) => /[a-z]/.test(v)
	},
	{
		label: 'Contains a number',
		test: (v: string) => /\d/.test(v)
	},
	{
		label: 'Contains a special character',
		test: (v: string) => /[@$!%*?&+]/.test(v)
	}
];

export type RegisterSchema = typeof registerSchema;
