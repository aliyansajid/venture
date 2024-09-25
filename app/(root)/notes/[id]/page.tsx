"use client";

import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import TopHeader from "@/components/TopHeader";
import Tiptap from "@/components/Editor/Tiptap";
import { useToast } from "@/components/ui/use-toast";
import NoteHeader from "@/components/Notes/NoteHeader";
import {
  fetchNote,
  updateNoteDescription,
  updateNoteTitle,
} from "@/app/actions/noteActions";

const NoteDetail = ({ params: { id } }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [noteNotFound, setNoteNotFound] = useState(false);

  useEffect(() => {
    const handleFetchNote = async () => {
      try {
        const result = await fetchNote(id);

        if (result.success) {
          setTitle(result.note?.title as string);
          setDescription(result.note?.description ?? "");
        } else {
          setNoteNotFound(true);
          toast({
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "An error occurred while fetching the note.",
          variant: "destructive",
        });
        setNoteNotFound(true);
      } finally {
        setIsFetching(false);
      }
    };

    handleFetchNote();
  }, [id]);

  const handleUpdateTitle = async (newTitle: string) => {
    setIsSaving(true);
    try {
      const result = await updateNoteTitle(id, newTitle);

      if (result.success) {
        setTitle(newTitle);
        toast({
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Error updating title.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async (newDescription: string) => {
    setIsSaving(true);
    try {
      const result = await updateNoteDescription(id, newDescription);

      if (result.success) {
        setDescription(newDescription);
        toast({
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Error saving content.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <TopHeader />
      {isFetching ? (
        <Loader />
      ) : noteNotFound ? (
        <div className="flex justify-center items-center h-[calc(100vh-72px)]">
          <h1 className="text-xl font-medium">
            The requested note could not be found.
          </h1>
        </div>
      ) : (
        <>
          <NoteHeader
            title={title}
            onUpdateTitle={handleUpdateTitle}
            onSave={() => handleSaveDescription(description)}
            isSaving={isSaving}
            noteId={id}
          />
          <Tiptap
            description={description}
            onChange={(newDescription) => setDescription(newDescription)}
          />
        </>
      )}
    </section>
  );
};

export default NoteDetail;
