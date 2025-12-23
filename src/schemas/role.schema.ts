import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .optional(),
  description: z.string().optional(),
});

export const assignPermissionsSchema = z.object({
  permissionIds: z.array(z.string().uuid('Invalid permission ID')).min(0),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
export type AssignPermissionsFormData = z.infer<
  typeof assignPermissionsSchema
>;

