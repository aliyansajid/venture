"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModalDialog from "@/components/ModalDialog";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { DataTableRowActionsProps } from "@/types/next-auth";
import { deleteUser } from "@/app/actions/userActions";
import { deleteTeam } from "@/app/actions/teamActions";

export function DataTableRowActions<TData extends { id: string }>({
  row,
  entityName,
  EditComponent,
}: DataTableRowActionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const entityId = row.original.id;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      let result;

      if (entityName === "user") {
        result = await deleteUser(entityId);
      } else if (entityName === "team") {
        result = await deleteTeam(entityId);
      }

      if (!result?.success) {
        toast({
          description: result?.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: result?.message,
          variant: "default",
        });
      }

      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      toast({
        description: `Error deleting the ${entityName}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <Ellipsis size={16} />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            <Pencil size={16} /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDeleteModal && (
        <ModalDialog
          isOpen={showDeleteModal}
          title={`Confirm Delete`}
          description={`Are you sure you want to delete this ${entityName}? This action cannot be undone.`}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="flex flex-col space-y-2">
            <CustomButton
              variant={ButtonVariant.DEFAULT}
              text="Cancel"
              onClick={() => setShowDeleteModal(false)}
              className="w-full"
            />
            <CustomButton
              variant={ButtonVariant.DESTRUCTIVE}
              text="Delete"
              onClick={handleDelete}
              className="w-full"
              isLoading={isLoading}
            />
          </div>
        </ModalDialog>
      )}

      {showEditModal && (
        <ModalDialog
          isOpen={showEditModal}
          title={`Edit ${entityName}`}
          description={`Edit the details of the ${entityName}.`}
          onClose={() => setShowEditModal(false)}
        >
          <EditComponent id={entityId} teamId={entityId} userId={entityId} />
        </ModalDialog>
      )}
    </>
  );
}
