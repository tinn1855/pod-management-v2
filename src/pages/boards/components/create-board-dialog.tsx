import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBoardSchema, type CreateBoardFormData } from '@/schemas/board.schema';
import type { User } from '@/types/user.types';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designers: User[];
  isLoading: boolean;
  onSubmit: (data: CreateBoardFormData) => void;
}

export function CreateBoardDialog({
  open,
  onOpenChange,
  designers,
  isLoading,
  onSubmit,
}: CreateBoardDialogProps) {
  const form = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: '',
      dueDate: '',
      priority: 'MEDIUM',
      assigneeDesignerId: undefined,
    },
  });

  const handleSubmit = (data: CreateBoardFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new board with title, due date, priority, and optional
            assignee designer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Design Review Board" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Due Date <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Priority <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">LOW</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                      <SelectItem value="URGENT">URGENT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeDesignerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee Designer (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value || undefined)
                    }
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designer (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {designers.map((designer) => (
                        <SelectItem key={designer.id} value={designer.id}>
                          {designer.name} ({designer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Board'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

