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

export interface OTPFormProps {
  email: string;
  firstName: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string | null;
  dateOfJoining: Date;
  image: string | null;
}

export interface Team {
  id: string;
  teamName: string;
  teamLead: {
    firstName: string;
    lastName: string;
    email: string;
  };
  teamMembers: {
    firstName: string;
    lastName: string;
    email: string;
  }[];
  createdAt: Date;
}

export interface TeamUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface AddTeamFormProps {
  teamId?: string;
  onSuccess?: () => void;
}

export interface EditUserProps {
  userId?: string;
  onSuccess?: () => void;
}

export interface NoteDetailProps {
  params: { id: string };
}

export interface ProjectDetailProps {
  params: { id: string };
}

export interface ProjectFormProps {
  projectId?: string;
}
export interface NoteTagsProps {
  noteId: string;
}

export type FormData = {
  tags: string[];
};

export interface AddNoteButtonProps {
  authorId: string;
}

export interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  authorImage: string;
  timestamp: string;
}

export interface NoteHeaderProps {
  title: string;
  onUpdateTitle: (newTitle: string) => Promise<void>;
  onSave: () => void;
  isSaving: boolean;
  noteId: string;
  children?: React.ReactNode;
}

export interface ModalDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
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

export interface FilterValue {
  key: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date;
  budget: number | null;
  teamId: string;
  clientId: string | null;
  userId: string;
  totalTasks: number;
  completedTasks: number;
  priority: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
