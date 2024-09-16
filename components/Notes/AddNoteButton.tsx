"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { useToast } from "@/components/ui/use-toast";
import { AddNoteButtonProps } from "@/types/next-auth";
import { createNote } from "@/app/actions/noteActions";

const AddNoteButton = ({ authorId }: AddNoteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateNote = async () => {
    try {
      setIsLoading(true);

      const result = await createNote(authorId);

      if (result.success) {
        router.push(`/notes/${result.id}`);
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
      toast({
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        description: "An error occurred while creating the note.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomButton
      variant={ButtonVariant.DEFAULT}
      text={"Add Note"}
      disabled={isLoading}
      isLoading={isLoading}
      onClick={handleCreateNote}
    />
  );
};

export default AddNoteButton;
