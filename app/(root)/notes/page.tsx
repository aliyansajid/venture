"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopHeader from "@/components/TopHeader";
import SectionHeader from "@/components/SectionHeader";
import AddNoteButton from "@/components/Notes/AddNoteButton";
import NoteCard from "@/components/Notes/NoteCard";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import { fetchNotes } from "@/app/actions/noteActions";
import { Note } from "@/types/next-auth";

const Notes = () => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleFetchNotes = async () => {
      if (!session?.user?.id) return;

      try {
        const result = await fetchNotes(session.user.id);

        if (!result.success) {
          toast({
            description: result.message,
            variant: "destructive",
          });
        }

        setNotes(result.notes || []);
      } catch (error: any) {
        toast({
          description: "An unexpected error occurred while fetching the notes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchNotes();
  }, [session, toast]);

  return (
    <section>
      <TopHeader />
      <SectionHeader title="Notes">
        <AddNoteButton />
      </SectionHeader>
      {isLoading ? (
        <Loader />
      ) : notes.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-144px)]">
          <h1 className="text-xl font-medium">
            You have not created any notes yet.
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-8 lg:px-8">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              description={note.description}
              tags={note.tags}
              authorName={session?.user?.name}
              authorImage={session?.user?.image}
              createdAt={note.createdAt}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Notes;
