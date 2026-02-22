export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '14.1';
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			admin_user_sections: {
				Row: {
					section_id: number;
					user_id: number;
				};
				Insert: {
					section_id: number;
					user_id: number;
				};
				Update: {
					section_id?: number;
					user_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'allowed_user_sections_section_id_fkey';
						columns: ['section_id'];
						isOneToOne: false;
						referencedRelation: 'sections';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'allowed_user_sections_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					}
				];
			};
			admin_users: {
				Row: {
					domain: string;
					given_password: string;
					id: number;
					is_registered: boolean | null;
					name: string | null;
					org_id: string;
					role: Database['public']['Enums']['STUDENT_ACCESS'];
				};
				Insert: {
					domain: string;
					given_password: string;
					id?: number;
					is_registered?: boolean | null;
					name?: string | null;
					org_id: string;
					role?: Database['public']['Enums']['STUDENT_ACCESS'];
				};
				Update: {
					domain?: string;
					given_password?: string;
					id?: number;
					is_registered?: boolean | null;
					name?: string | null;
					org_id?: string;
					role?: Database['public']['Enums']['STUDENT_ACCESS'];
				};
				Relationships: [];
			};
			attendances: {
				Row: {
					admin_user_id: number | null;
					id: number;
					student_id: number;
					timestamp: string;
				};
				Insert: {
					admin_user_id?: number | null;
					id?: number;
					student_id: number;
					timestamp: string;
				};
				Update: {
					admin_user_id?: number | null;
					id?: number;
					student_id?: number;
					timestamp?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'attendances_admin_user_id_fkey';
						columns: ['admin_user_id'];
						isOneToOne: false;
						referencedRelation: 'admin_users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'attendances_student_id_fkey';
						columns: ['student_id'];
						isOneToOne: false;
						referencedRelation: 'students';
						referencedColumns: ['id'];
					}
				];
			};
			schools: {
				Row: {
					decryption_key: string;
					domain: string | null;
					id: number;
					name: string;
				};
				Insert: {
					decryption_key?: string;
					domain?: string | null;
					id?: number;
					name: string;
				};
				Update: {
					decryption_key?: string;
					domain?: string | null;
					id?: number;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'schools_domain_fkey';
						columns: ['domain'];
						isOneToOne: true;
						referencedRelation: 'schools';
						referencedColumns: ['domain'];
					}
				];
			};
			sections: {
				Row: {
					id: number;
					level: number;
					school_id: number;
					section: string;
				};
				Insert: {
					id?: number;
					level: number;
					school_id: number;
					section: string;
				};
				Update: {
					id?: number;
					level?: number;
					school_id?: number;
					section?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'sections_school_id_fkey';
						columns: ['school_id'];
						isOneToOne: false;
						referencedRelation: 'schools';
						referencedColumns: ['id'];
					}
				];
			};
			student_users: {
				Row: {
					given_password: string;
					id: number;
					is_registered: boolean;
					lrn: number;
				};
				Insert: {
					given_password: string;
					id?: number;
					is_registered?: boolean;
					lrn: number;
				};
				Update: {
					given_password?: string;
					id?: number;
					is_registered?: boolean;
					lrn?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'student_users_lrn_fkey';
						columns: ['lrn'];
						isOneToOne: true;
						referencedRelation: 'students';
						referencedColumns: ['id'];
					}
				];
			};
			students: {
				Row: {
					avatar: string | null;
					first_name: string;
					id: number;
					last_name: string;
					middle_name: string | null;
					section_id: number;
					sex: Database['public']['Enums']['SEX'] | null;
				};
				Insert: {
					avatar?: string | null;
					first_name: string;
					id?: number;
					last_name: string;
					middle_name?: string | null;
					section_id: number;
					sex?: Database['public']['Enums']['SEX'] | null;
				};
				Update: {
					avatar?: string | null;
					first_name?: string;
					id?: number;
					last_name?: string;
					middle_name?: string | null;
					section_id?: number;
					sex?: Database['public']['Enums']['SEX'] | null;
				};
				Relationships: [
					{
						foreignKeyName: 'students_section_id_fkey';
						columns: ['section_id'];
						isOneToOne: false;
						referencedRelation: 'sections';
						referencedColumns: ['id'];
					}
				];
			};
			user_devices: {
				Row: {
					created_at: string | null;
					fcm_token: string;
					id: string;
					student_user_id: number | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					fcm_token: string;
					id?: string;
					student_user_id?: number | null;
					user_id?: string;
				};
				Update: {
					created_at?: string | null;
					fcm_token?: string;
					id?: string;
					student_user_id?: number | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_devices_student_user_id_fkey';
						columns: ['student_user_id'];
						isOneToOne: true;
						referencedRelation: 'student_users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			admin_mark_as_registered: { Args: { admin_id: number }; Returns: number };
			check_access_attendance: {
				Args: { p_mode: string; p_student_id: number };
				Returns: boolean;
			};
			check_access_school: { Args: { p_school_id: number }; Returns: boolean };
			check_access_section: { Args: { p_section_id: number }; Returns: boolean };
			check_access_student: { Args: { p_student_id: number }; Returns: boolean };
			get_admin_user_json: {
				Args: { domain: string; org_id: string };
				Returns: Json;
			};
			get_student_user_json: { Args: { lrn: number }; Returns: Json };
			student_mark_as_registered: {
				Args: { student_id: number };
				Returns: number;
			};
		};
		Enums: {
			SEX: 'MALE' | 'FEMALE';
			STUDENT_ACCESS: 'CLASS' | 'LEVEL' | 'FULL';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {}
	},
	public: {
		Enums: {
			SEX: ['MALE', 'FEMALE'],
			STUDENT_ACCESS: ['CLASS', 'LEVEL', 'FULL']
		}
	}
} as const;
