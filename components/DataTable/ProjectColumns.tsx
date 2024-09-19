import { ColumnDef } from "@tanstack/react-table";

export const projectColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: "team.teamName",
    header: "Team Name",
    cell: ({ row }) => row.original.team.teamName,
  },
  {
    accessorKey: "team.teamLead",
    header: "Team Lead",
    cell: ({ row }) => {
      const lead = row.original.team.teamLead;
      return `${lead.firstName} ${lead.lastName}`;
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => `$${row.original.budget}`,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => row.original.priority,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = new Date(row.original.dueDate);
      return date.toLocaleDateString();
    },
  },
];
