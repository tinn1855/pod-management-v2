import { z } from 'zod';

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    required_error: 'Priority is required',
  }),
  assigneeDesignerId: z.string().uuid('Invalid assignee ID').optional(),
});

export const updateBoardSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters')
    .optional(),
  dueDate: z.string().min(1, 'Due date is required').optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
      required_error: 'Priority is required',
    })
    .optional(),
  assigneeDesignerId: z.string().uuid('Invalid assignee ID').nullable().optional(),
});

export type CreateBoardFormData = z.infer<typeof createBoardSchema>;
export type UpdateBoardFormData = z.infer<typeof updateBoardSchema>;

