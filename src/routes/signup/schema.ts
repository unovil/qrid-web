import { z } from 'zod';

export const verifySchema = z.object({
	domain: z.string().nonempty('Domain should not be empty.'),
	domainId: z.string().nonempty('Domain ID should not be empty.'),
	password: z.string().nonempty('Password should not be empty.')
});

export type VerifySchema = typeof verifySchema;

export const signUpSchema = z
	.object({
		email: z.email('Invalid email address.').nonoptional('Email should not be empty.'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long')
			.regex(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one digit.'
			),
		confirmPassword: z.string().nonempty('Please confirm your password.')
	})
	.refine((data) => data.password === data.confirmPassword, 'Passwords do not match.');

export type SignUpSchema = typeof signUpSchema;
