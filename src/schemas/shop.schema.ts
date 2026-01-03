import { z } from 'zod';

export const createShopSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
});

export const updateShopSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  status: z.string().optional(),
  platformIds: z.array(z.string()).optional(),
});

export type CreateShopFormData = z.infer<typeof createShopSchema>;
export type UpdateShopFormData = z.infer<typeof updateShopSchema>;

