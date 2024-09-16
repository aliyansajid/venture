"use client";
import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  List as UnorderedListIcon,
  ListOrdered as OrderedListIcon,
  CheckSquare as TaskListIcon,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="flex items-center toolbar gap-6">
      <div className="flex gap-3">
        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="toolbar-icon" />
        </Toggle>
      </div>

      <div className="h-9 border-l border-border-primary"></div>

      <div className="flex gap-3">
        <Toggle
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().setHeading({ level: 1 }).run()
          }
        >
          <span className="toolbar-icon">H1</span>
        </Toggle>
        <Toggle
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().setHeading({ level: 2 }).run()
          }
        >
          <span className="toolbar-icon">H2</span>
        </Toggle>
        <Toggle
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().setHeading({ level: 3 }).run()
          }
        >
          <span className="toolbar-icon">H3</span>
        </Toggle>
      </div>

      <div className="h-9 border-l border-border-primary"></div>

      <div className="flex gap-3">
        <Toggle
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
        >
          <AlignLeft className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
        >
          <AlignCenter className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
        >
          <AlignRight className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
        >
          <AlignJustify className="toolbar-icon" />
        </Toggle>
      </div>

      <div className="h-9 border-l border-border-primary"></div>

      <div className="flex gap-3">
        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <UnorderedListIcon className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <OrderedListIcon className="toolbar-icon" />
        </Toggle>
        <Toggle
          pressed={editor.isActive("taskList")}
          onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
        >
          <TaskListIcon className="toolbar-icon" />
        </Toggle>
      </div>
    </div>
  );
}

export default Toolbar;
