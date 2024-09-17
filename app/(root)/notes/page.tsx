"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopHeader from "@/components/TopHeader";
import SectionHeader from "@/components/SectionHeader";
import AddNoteButton from "@/components/Notes/AddNoteButton";
import NoteCard from "@/components/Notes/NoteCard";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";
import { formatTimestamp } from "@/lib/utils";
import { fetchNotes } from "@/app/actions/noteActions";

const Notes = () => {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
          description: error.message,
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
        <AddNoteButton authorId={session?.user?.id as string} />
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
              description={note.content}
              tags={note.tags}
              authorName={session?.user.name || "Unknown Author"}
              authorImage={session?.user.image || "/icons/UserCircle.svg"}
              timestamp={formatTimestamp(note.createdAt)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Notes;
