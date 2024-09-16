"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./FacetedFilter";
import { DataTableViewOptions } from "./ViewOptions";
import { Trash2, X } from "lucide-react";
import ModalDialog from "@/components/ModalDialog";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { DataTableToolbarProps } from "@/types/next-auth";
import { deleteUsers } from "@/app/actions/userActions";

export function DataTableToolbar<TData extends { id: string }>({
  table,
  searchColumnKey,
  filterColumnKey,
  filterValues,
  filterTitle,
  entity,
}: DataTableToolbarProps<TData>) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;
  const filterOptions = filterValues.map((filter) => ({
    label: filter.value
      .replace(/-/g, " ")
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
    value: filter.key,
  }));

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const itemIds = selectedRows.map((row) => row.original.id);

      let result;

      if (entity === "users") {
        result = await deleteUsers(itemIds);
      }

      if (!result?.success) {
        toast({
          description: result?.message || "Failed to delete the items.",
          variant: "destructive",
        });
      } else {
        toast({
          description: result.message,
          variant: "default",
        });
      }

      setShowDeleteModal(false);
      router.refresh();
    } catch (error) {
      toast({
        description: `Error deleting the ${entity}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <Input
          placeholder="Enter name to search"
          value={
            (table.getColumn(searchColumnKey)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table
              .getColumn(searchColumnKey)
              ?.setFilterValue(event.target.value);
          }}
          className="w-[150px] lg:w-[250px]"
        />
        {table.getColumn(filterColumnKey) && (
          <DataTableFacetedFilter
            column={table.getColumn(filterColumnKey)}
            title={filterTitle}
            options={filterOptions}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()}>
            Reset
            <X size={16} />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {selectedRows.length > 0 ? (
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={16} aria-hidden="true" />
              Delete ({selectedRows.length})
            </Button>

            {showDeleteModal && (
              <ModalDialog
                isOpen={showDeleteModal}
                title={`Confirm Delete`}
                description={`Are you sure you want to delete the selected ${entity}? This action cannot be undone.`}
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
          </>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
