import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        return z.string().email().safeParse(val).success;
      },
      { message: 'Invalid email address' }
    )
    .optional(),
  password: z
    .string()
    .refine((val) => !val || val.length >= 6, {
      message: 'Password must be at least 6 characters',
    })
    .optional(),
  roleId: z.string().uuid('Invalid role ID'),
  teamId: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        return z.string().uuid().safeParse(val).success;
      },
      { message: 'Invalid team ID' }
    )
    .optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .optional(),
  roleId: z.string().uuid('Invalid role ID').optional(),
  teamId: z.string().optional(),
  status: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

