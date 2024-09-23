"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { useToast } from "@/components/ui/use-toast";
import { createNote } from "@/app/actions/noteActions";
import { useSession } from "next-auth/react";

const AddNoteButton = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const isButtonDisabled = isLoading || !session?.user?.id;

  const handleCreateNote = async () => {
    if (!session?.user?.id) {
      toast({
        description: "Please log in again to add a note.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const result = await createNote(session.user.id);

      if (result.success) {
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
      text={"Add Note"}
      disabled={isButtonDisabled}
      isLoading={isLoading}
      onClick={handleCreateNote}
    />
  );
};

export default AddNoteButton;
