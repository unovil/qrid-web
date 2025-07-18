import { relations } from 'drizzle-orm/relations';
import {
	allowedUsers,
	allowedUserSections,
	attendances,
	schools,
	sections,
	students
} from './schema';

export const sectionsRelations = relations(sections, ({ one, many }) => ({
	school: one(schools, {
		fields: [sections.schoolId],
		references: [schools.id]
	}),
	allowedUserSections: many(allowedUserSections),
	students: many(students)
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
	sections: many(sections),
	school: one(schools, {
		fields: [schools.domain],
		references: [schools.domain],
		relationName: 'schools_domain_schools_domain'
	}),
	schools: many(schools, {
		relationName: 'schools_domain_schools_domain'
	})
}));

export const allowedUserSectionsRelations = relations(allowedUserSections, ({ one }) => ({
	section: one(sections, {
		fields: [allowedUserSections.sectionId],
		references: [sections.id]
	}),
	allowedUser: one(allowedUsers, {
		fields: [allowedUserSections.userId],
		references: [allowedUsers.id]
	})
}));

export const allowedUsersRelations = relations(allowedUsers, ({ many }) => ({
	allowedUserSections: many(allowedUserSections),
	attendances: many(attendances)
}));

export const attendancesRelations = relations(attendances, ({ one }) => ({
	allowedUser: one(allowedUsers, {
		fields: [attendances.allowedUserId],
		references: [allowedUsers.id]
	}),
	student: one(students, {
		fields: [attendances.studentId],
		references: [students.id]
	})
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
	attendances: many(attendances),
	section: one(sections, {
		fields: [students.sectionId],
		references: [sections.id]
	})
}));
