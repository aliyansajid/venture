import NextAuth from "next-auth";
import { Table } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string | null;
      image?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}

export interface FilterValue {
  key: string;
  value: string;
}

export interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
}

export interface ModalDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface User {
  id: string;
  image: string | null;
  firstName: string;
  lastName: string;
  email: string;
  dateOfJoining: Date;
  role: string;
}

export interface UserAction {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  modalTitle?: string;
  modalDescription?: string;
  component?: React.ComponentType;
}

interface Note {
  id: string;
  title: string;
  description?: string | null;
  tags: string[];
  authorName?: string;
  authorImage?: string;
  createdAt: Date;
}

export interface NoteHeaderProps {
  title: string;
  onUpdateTitle: (newTitle: string) => Promise<void>;
  onSave: () => void;
  isSaving: boolean;
  noteId: string;
  children?: React.ReactNode;
}

export interface Team {
  id: string;
  teamName: string;
  teamLead: {
    firstName: string;
    lastName: string;
    image: string | null;
  };
  teamMembers: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    role: string;
  }[];
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role?: string;
}

export interface Project {
  id: string;
  title: string;
  tags: string[];
  dueDate: Date;
  priority: string;
  status?: string | null;
  budget?: number | null;
  totalTasks: number;
  completedTasks: number;
  teamId: string;
  clientId?: string | null;
  userId: string;
  team: Team["id, teamMembers"];
  client?: Client | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCardProps {
  id: string;
  title: string;
  tags: string[];
  dueDate: Date;
  totalTasks: number;
  completedTasks: number;
  client?: Client | null;
  teamMembers: Team["teamMembers"];
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  priority: string;
  status?: string | null;
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string | null;
  };
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumnKey: string;
  filterColumnKey: string;
  filterValues?: { key: string; value: string }[];
  filterTitle: string;
  entity: string;
  onUpdate: () => void;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  pageSize: number;
}

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  className?: string;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  pageSize: number;
}

export interface DataTableRowActionsProps<TData extends { id: string }> {
  row: Row<TData>;
  api: string;
  entityName: string;
  EditComponent: React.ComponentType<{
    id: string;
    teamId?: string;
    userId?: string;
  }>;
}

interface DataTableToolbarProps<TData extends { id: string }> {
  table: Table<TData>;
  searchColumnKey: string;
  filterColumnKey: string;
  filterValues: { key: string; value: string }[];
  filterTitle: string;
  entity: string;
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  className?: string;
}
