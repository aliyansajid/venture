"use client";

import { useState, useEffect, useRef } from "react";
import NoteHeader from "@/components/Notes/NoteHeader";
import TopHeader from "@/components/TopHeader";
import Tiptap from "@/components/Editor/Tiptap";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchNote,
  updateNoteContent,
  updateNoteTitle,
} from "@/app/actions/noteActions";

const NoteDetail = ({ params: { id } }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [noteNotFound, setNoteNotFound] = useState(false);
  const contentRef = useRef<string>("");

  const showToast = (
    message: string,
    variant: "default" | "destructive" = "default"
  ) => {
    toast({
      description: message,
      variant,
    });
  };

  useEffect(() => {
    const handleFetchNote = async () => {
      try {
        const result = await fetchNote(id);

        if (result.success) {
          setTitle(result.note?.title as string);
          const noteContent = result.note?.description ?? "";
          setContent(noteContent);
          contentRef.current = noteContent;
        } else {
          setNoteNotFound(true);
          showToast(
            result.message ?? "An unexpected error occurred.",
            "destructive"
          );
        }
      } catch (error) {
        showToast("An error occurred while fetching the note.", "destructive");
        setNoteNotFound(true);
      } finally {
        setIsFetching(false);
      }
    };

    handleFetchNote();
  }, [id, showToast]);

  const handleUpdateTitle = async (newTitle: string) => {
    setIsSaving(true);
    try {
      const result = await updateNoteTitle(id, newTitle);

      showToast(result.message, result.success ? "default" : "destructive");

      if (result.success) {
        setTitle(newTitle);
      }
    } catch (error) {
      showToast("Error updating title.", "destructive");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContent = async () => {
    const currentContent = contentRef.current;

    if (currentContent.trim() === "" || currentContent === content) {
      showToast(
        currentContent.trim() === ""
          ? "Content cannot be blank."
          : "No changes made to the content.",
        "destructive"
      );
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateNoteContent(id, currentContent);
      showToast(result.message, result.success ? "default" : "destructive");

      if (result.success) {
        setContent(currentContent);
      }
    } catch (error) {
      showToast("Error saving content.", "destructive");
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
            onSave={handleSaveContent}
            isSaving={isSaving}
            noteId={id}
          />

          <Tiptap
            description={content}
            onChange={(newContent) => {
              contentRef.current = newContent;
            }}
          />
        </>
      )}
    </section>
  );
};

export default NoteDetail;
