"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CustomButton, { ButtonVariant } from "@/components/CustomButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import ModalDialog from "@/components/ModalDialog";
import { noteActions } from "@/data/index";
import { toast } from "../ui/use-toast";
import { EllipsisVertical, SquarePen } from "lucide-react";
import { NoteHeaderProps } from "@/types/next-auth";
import { deleteNote } from "@/app/actions/noteActions";

const NoteHeader = ({
  title,
  onUpdateTitle,
  onSave,
  isSaving,
  noteId,
  children,
}: NoteHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noteTitle, setNoteTitle] = useState(title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setNoteTitle(title);
  }, [title]);

  const updateTitleHandler = useCallback(async () => {
    if (!noteTitle.trim()) {
      toast({
        description: "Title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (noteTitle !== title) {
      await onUpdateTitle(noteTitle.trim());
      toast({
        description: "Title updated successfully.",
        variant: "default",
      });
    } else {
      toast({
        description: "No changes made.",
        variant: "default",
      });
    }
    setIsEditing(false);
  }, [noteTitle, title, onUpdateTitle]);

  const handleSaveClick = async () => {
    if (isEditing) {
      await updateTitleHandler();
    }
    if (!noteTitle.trim()) {
      toast({
        description: "Title cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    await onSave();
  };

  const handleDeleteNote = async () => {
    setIsLoading(true);
    try {
      const result = await deleteNote(noteId);

      if (!result.success) {
        return;
      }

      setIsModalOpen(false);
      router.push("/notes");
    } catch (error) {
      toast({
        description: "Error deleting the note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuItem = async (menuItem: any) => {
    try {
      if (menuItem.action === "deleteNote") {
        setModalContent({
          title: "Confirm Delete",
          description:
            "Are you sure you want to delete this note? This action cannot be undone.",
        });
        setModalChildren(
          <div className="flex flex-col space-y-2">
            <CustomButton
              variant={ButtonVariant.DEFAULT}
              text="Cancel"
              onClick={() => setIsModalOpen(false)}
              className="w-full"
            />
            <CustomButton
              variant={ButtonVariant.DESTRUCTIVE}
              text="Delete"
              onClick={async () => {
                await handleDeleteNote();
              }}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        );
        setIsModalOpen(true);
      } else if (menuItem.component) {
        setModalContent({
          title: menuItem.modalTitle,
          description: menuItem.modalDescription,
        });
        setModalChildren(React.createElement(menuItem.component, { noteId }));
        setIsModalOpen(true);
      }
    } catch (error) {
      toast({
        description: `Error processing ${menuItem.action}:`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (isEditing) {
          updateTitleHandler();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, updateTitleHandler]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="border-b border-border-primary h-[69px] flex items-center justify-between gap-3 px-4 lg:px-8">
      <div
        ref={containerRef}
        className="flex w-fit items-center justify-center gap-2"
      >
        {isEditing && !isSaving ? (
          <div className="flex flex-col">
            <input
              type="text"
              value={noteTitle}
              ref={inputRef}
              placeholder="Enter title"
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateTitleHandler();
              }}
              onBlur={updateTitleHandler}
              maxLength={40}
              className="text-2xl text-dark-primary font-medium document-title-input border-none outline-none"
            />
            <span className="text-sm text-gray-500">
              {noteTitle.length}/40 characters
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="text-2xl text-dark-primary font-medium truncate md:truncate-none max-w-[240px] md:max-w-full">
              {noteTitle}
            </h1>
            <SquarePen
              className="text-dark-secondary cursor-pointer"
              onClick={() => setIsEditing(true)}
              size={20}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <CustomButton
          variant={ButtonVariant.DEFAULT}
          text={"Save"}
          onClick={handleSaveClick}
          isLoading={isSaving}
          disabled={isSaving}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical className="cursor-pointer" size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {noteActions.map((item) => (
              <DropdownMenuItem
                key={item.label}
                onClick={() => handleMenuItem(item)}
              >
                <item.icon size={16} />
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {children}
      </div>

      {isModalOpen && (
        <ModalDialog
          isOpen={isModalOpen}
          title={modalContent.title}
          description={modalContent.description}
          onClose={() => setIsModalOpen(false)}
        >
          {modalChildren}
        </ModalDialog>
      )}
    </div>
  );
};

export default NoteHeader;
