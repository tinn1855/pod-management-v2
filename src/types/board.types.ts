export interface Board {
  id: string;
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  updatedAt: string;
  assigneeDesigner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt?: string;
}

export interface CreateBoardDto {
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeDesignerId?: string;
}

export interface UpdateBoardDto {
  title?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeDesignerId?: string | null;
}

export interface BoardListResponse {
  data: Board[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

