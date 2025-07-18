import {
	bigint,
	bigserial,
	boolean,
	check,
	foreignKey,
	pgEnum,
	pgPolicy,
	pgTable,
	smallint,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const studentAccess = pgEnum('STUDENT_ACCESS', ['CLASS', 'LEVEL', 'FULL']);

export const sections = pgTable(
	'sections',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({
			name: 'sections_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 9223372036854775807,
			cache: 1
		}),
		level: smallint().notNull(),
		section: varchar({ length: 24 }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		schoolId: bigint('school_id', { mode: 'number' }).notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: 'sections_school_id_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		pgPolicy('Section access by granular role', {
			as: 'permissive',
			for: 'select',
			to: ['authenticated'],
			using: sql`(EXISTS ( SELECT 1
   FROM allowed_users au
  WHERE ((au.id = (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'allowed_user_id'::text))::integer) AND (((au.role = 'CLASS'::"STUDENT_ACCESS") AND (EXISTS ( SELECT 1
           FROM allowed_user_sections aus
          WHERE ((aus.user_id = au.id) AND (aus.section_id = sections.id))))) OR ((au.role = 'LEVEL'::"STUDENT_ACCESS") AND (EXISTS ( SELECT 1
           FROM allowed_user_sections aus
          WHERE ((aus.user_id = au.id) AND (aus.section_id = sections.id))))) OR ((au.role = 'FULL'::"STUDENT_ACCESS") AND (EXISTS ( SELECT 1
           FROM schools sc
          WHERE ((sc.domain = au.domain) AND (sc.id = sections.school_id)))))))))`
		})
	]
);

export const allowedUserSections = pgTable(
	'allowed_user_sections',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		userId: bigint('user_id', { mode: 'number' }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		sectionId: bigint('section_id', { mode: 'number' }).notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.sectionId],
			foreignColumns: [sections.id],
			name: 'allowed_user_sections_section_id_fkey'
		}),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [allowedUsers.id],
			name: 'allowed_user_sections_user_id_fkey'
		}),
		pgPolicy('Enable read access for all users', {
			as: 'permissive',
			for: 'select',
			to: ['authenticated'],
			using: sql`true`
		})
	]
);

export const attendances = pgTable(
	'attendances',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({
			name: 'attendances_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 9223372036854775807,
			cache: 1
		}),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		studentId: bigint('student_id', { mode: 'number' }).notNull(),
		timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		allowedUserId: bigint('allowed_user_id', { mode: 'number' })
	},
	(table) => [
		foreignKey({
			columns: [table.allowedUserId],
			foreignColumns: [allowedUsers.id],
			name: 'attendances_allowed_user_id_fkey'
		})
			.onUpdate('cascade')
			.onDelete('set null'),
		foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: 'attendances_student_id_fkey'
		}).onDelete('cascade'),
		pgPolicy('Enable read access based on students', {
			as: 'permissive',
			for: 'select',
			to: ['authenticated'],
			using: sql`(EXISTS ( SELECT 1
   FROM students
  WHERE (attendances.student_id = students.id)))`
		}),
		pgPolicy('Enable insert based on students', {
			as: 'permissive',
			for: 'insert',
			to: ['authenticated']
		})
	]
);

export const allowedUsers = pgTable(
	'allowed_users',
	{
		id: bigserial({ mode: 'bigint' }).notNull(),
		domain: text().notNull(),
		orgId: text('org_id').notNull(),
		givenPassword: text('given_password').notNull(),
		isRegistered: boolean('is_registered').default(false),
		role: studentAccess().default('CLASS').notNull()
	},
	(_table) => [
		pgPolicy('Enable read access for its own account', {
			as: 'permissive',
			for: 'select',
			to: ['authenticated'],
			using: sql`((((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) -> 'allowed_user_id'::text))::integer = id)`
		})
	]
);

export const students = pgTable(
	'students',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({
			name: 'students_lrn_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 9223372036854775807,
			cache: 1
		}),
		lastName: text('last_name').notNull(),
		firstName: text('first_name').notNull(),
		middleName: text('middle_name'),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		sectionId: bigint('section_id', { mode: 'number' }).notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.sectionId],
			foreignColumns: [sections.id],
			name: 'students_section_id_fkey'
		})
			.onUpdate('cascade')
			.onDelete('cascade'),
		pgPolicy('Student access by granular role', {
			as: 'permissive',
			for: 'select',
			to: ['authenticated'],
			using: sql`(EXISTS ( SELECT 1
   FROM allowed_users au
  WHERE ((au.id = (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'allowed_user_id'::text))::integer) AND (((au.role = 'CLASS'::"STUDENT_ACCESS") AND (EXISTS ( SELECT 1
           FROM allowed_user_sections aus
          WHERE ((aus.user_id = au.id) AND (aus.section_id = students.section_id))))) OR ((au.role = 'LEVEL'::"STUDENT_ACCESS") AND (EXISTS ( SELECT 1
           FROM allowed_user_sections aus
          WHERE ((aus.user_id = au.id) AND (aus.section_id = students.section_id))))) OR ((au.role = 'FULL'::"STUDENT_ACCESS") AND (EXISTS ( SELECT 1
           FROM sections s
          WHERE ((s.id = students.section_id) AND (s.school_id IN ( SELECT sc.id
                   FROM schools sc
                  WHERE (sc.domain = au.domain)))))))))))`
		}),
		check(
			'students_first_name_check',
			sql`(length(first_name) > 0) AND (length(first_name) <= 50)`
		),
		check('students_last_name_check', sql`(length(last_name) > 0) AND (length(last_name) <= 32)`),
		check(
			'students_lrn_check',
			sql`(id >= '100000000000'::bigint) AND (id <= '999999999999'::bigint)`
		),
		check('students_middle_name_check', sql`length(middle_name) <= 16`)
	]
);

export const schools = pgTable(
	'schools',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({
			name: 'schools_id_seq',
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 9223372036854775807,
			cache: 1
		}),
		name: text().notNull(),
		domain: text(),
		decryptionKey: text('decryption_key')
			.default(
				sql`replace(replace(encode(extensions.gen_random_bytes(32), \'base64\'::text), \'+\'::text, \'-\'::text), \'/\'::text, \'_\'::text)`
			)
			.notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.domain],
			foreignColumns: [table.domain],
			name: 'schools_domain_fkey'
		}).onUpdate('cascade'),
		pgPolicy('School access by domain', {
			as: 'permissive',
			for: 'select',
			to: ['authenticated'],
			using: sql`(EXISTS ( SELECT 1
   FROM allowed_users au
  WHERE ((au.id = (((( SELECT auth.jwt() AS jwt) -> 'user_metadata'::text) ->> 'allowed_user_id'::text))::integer) AND (schools.domain = au.domain))))`
		})
	]
);
