import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .min(2, 'Team name must be at least 2 characters'),
  description: z.string().optional(),
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .min(2, 'Team name must be at least 2 characters')
    .optional(),
  description: z.string().optional(),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;

