"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { DataTableRowActions } from "./RowActions";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import AddTeamForm from "../forms/AddTeamForm";

export const teamColumns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "srNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sr." />
    ),
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Name" />
    ),
    cell: ({ row }) => <span>{row.original.teamName}</span>,
    filterFn: (row, id, value) => {
      const teamName = `${row.original.teamName}`.toLowerCase();
      return teamName.includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "teamLead",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Lead" />
    ),
    cell: ({ row }) => {
      const lead = row.original.teamLead;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={lead.image || "/icons/UserCircle.svg"}
            alt={`${lead.firstName} ${lead.lastName}`}
            width={32}
            height={32}
            className="rounded-full w-8 h-8 object-cover"
          />
          <span>{`${lead.firstName} ${lead.lastName}`}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.teamLead.id);
    },
  },
  {
    accessorKey: "members",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      const members = row.original.teamMembers || [];

      const formattedMembers = members.slice(0, 3).map((member: any) => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        designation: member.role,
        image: member.image || "/icons/UserCircle.svg",
      }));

      return (
        <div className="flex items-center">
          <AnimatedTooltip items={formattedMembers} />

          {members.length > 3 && (
            <div className="relative flex items-center justify-center w-[34px] h-[34px] rounded-full bg-action-secondary-selected text-sm border-2 border-white">
              +{members.length - 3}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dateCreated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return formattedDate;
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        api="teams"
        entityName="team"
        EditComponent={AddTeamForm}
        row={row}
      />
    ),
  },
];
