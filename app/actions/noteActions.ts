"use server";

import { db } from "@/lib/prisma";

export async function createNote(authorId: string) {
  try {
    const note = await db.note.create({
      data: {
        title: "Untitled",
        authorId,
      },
    });

    return {
      success: true,
      id: note.id,
      message: "Note created successfully.",
    };
  } catch (error: any) {
    console.error("Error creating note: ", error);
    return {
      success: false,
      message: "An error occurred while creating the note.",
    };
  }
}

export async function fetchNote(id: string) {
  try {
    const note = await db.note.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
      },
    });

    if (!note) {
      return { success: false, message: "Note not found.", status: 404 };
    }

    return {
      success: true,
      note,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error fetching note: ", error);
    return {
      success: false,
      message: "An error occurred while fetching the note.",
      status: 500,
    };
  }
}

export async function fetchNotes(id: string) {
  try {
    const notes = await db.note.findMany({
      where: { authorId: id },
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        createdAt: true,
      },
    });

    if (notes.length === 0) {
      return {
        success: true,
        notes: [],
        message: "No notes found for this user.",
        status: 200,
      };
    }

    return { success: true, notes, status: 200 };
  } catch (error: any) {
    console.error("Error fetching notes: ", error);
    return {
      success: false,
      message: "An error occurred while fetching the notes.",
      status: 500,
    };
  }
}

export async function updateNoteTitle(id: string, newTitle: string) {
  try {
    const updatedNote = await db.note.update({
      where: { id },
      data: { title: newTitle },
    });

    return {
      success: true,
      message: "Title updated successfully.",
      note: updatedNote,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error updating title: ", error);
    return {
      success: false,
      message: "Error updating title.",
      status: 500,
    };
  }
}

export async function updateNoteDescription(
  id: string,
  newDescription: string
) {
  try {
    const updatedNote = await db.note.update({
      where: { id },
      data: { description: newDescription },
    });

    return {
      success: true,
      message: "Content updated successfully.",
      note: updatedNote,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error updating content: ", error);
    return {
      success: false,
      message: "Error updating content.",
      status: 500,
    };
  }
}

export async function updateNoteTags(id: string, newTags: string[]) {
  try {
    const updatedNote = await db.note.update({
      where: { id },
      data: { tags: newTags },
    });

    return {
      success: true,
      message: "Tags updated successfully",
      note: updatedNote,
      status: 200,
    };
  } catch (error: any) {
    console.error("Error updating tags: ", error);
    return {
      success: false,
      message: "Error updating tags.",
      status: 500,
    };
  }
}

export async function deleteNote(noteId: string) {
  try {
    await db.note.delete({
      where: { id: noteId },
    });

    return {
      success: true,
      message: "Note deleted successfully.",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error deleting notes: ", error);
    return {
      success: false,
      message: "Failed to delete note.",
      status: 500,
    };
  }
}
