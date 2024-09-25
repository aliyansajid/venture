"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { createNote } from "@/app/actions/noteActions";
import CustomButton, { ButtonVariant } from "../CustomButton";

const AddNoteButton = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNote = async () => {
    if (!session?.user?.id) {
      toast({
        description: "Please log in again to create a note.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await createNote(session.user.id);

      if (result.success) {
        toast({
          description: result.message,
          variant: "default",
        });
        router.push(`/notes/${result.id}`);
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
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
      text="Add Note"
      onClick={handleCreateNote}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
};

export default AddNoteButton;
