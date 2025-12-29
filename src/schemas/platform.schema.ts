import { z } from 'zod';

export const createPlatformSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
});

export const updatePlatformSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
});

export type CreatePlatformFormData = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformFormData = z.infer<typeof updatePlatformSchema>;

