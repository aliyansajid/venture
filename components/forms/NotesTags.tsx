"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import CustomButton, { ButtonVariant } from "../CustomButton";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle } from "lucide-react";
import { toast } from "../ui/use-toast";
import { fetchNote, updateNoteTags } from "@/app/actions/noteActions";

const NoteTags = ({ noteId }: { noteId: string }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (
    message: string,
    variant: "default" | "destructive" = "default"
  ) => {
    toast({
      description: message,
      variant,
    });
  };

  const formSchema = z.object({
    tags: z.array(z.string().min(3).max(15)).max(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
    },
  });

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const result = await fetchNote(noteId);
        if (result.success) {
          setTags(result.note?.tags || []);
        } else {
          toast({
            description: "Failed to fetch tags.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "Failed to fetch tags.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [noteId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const value = inputValue.trim();

      if (value && value.length >= 3 && value.length <= 15 && tags.length < 5) {
        setTags((prevTags) => [...prevTags, value]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length) {
      setTags((prevTags) => prevTags.slice(0, -1));
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    form.setValue("tags", tags);
    try {
      const result = await updateNoteTags(noteId, tags);

      if (result.success) {
        showToast(result.message, "default");
      } else {
        showToast(result.message, "destructive");
      }
    } catch (error) {
      showToast("Error saving tags.", "destructive");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-md" />
        ) : (
          <>
            <div className="border border-interaction-outline-base p-1 min-h-10 h-auto rounded-md flex items-center flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-action-secondary-selected text-dark-primary text-sm font-medium px-3 py-1 gap-2 rounded-full flex items-center"
                >
                  <span>{tag}</span>

                  <XCircle
                    size={14}
                    className="text-dark-secondary cursor-pointer"
                    onClick={() => handleRemoveTag(index)}
                  />
                </div>
              ))}
              {tags.length < 5 && (
                <Controller
                  name="tags"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={inputValue}
                      placeholder="Add Tags"
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 min-w-[120px] border-none outline-none"
                    />
                  )}
                />
              )}
            </div>
            <div className="text-sm text-dark-secondary mt-2">
              3 tags maximum. Use letters and numbers only.
            </div>
          </>
        )}
        <CustomButton
          variant={ButtonVariant.DEFAULT}
          text={"Save"}
          className="w-full mt-5"
          disabled={isSaving || isLoading}
          isLoading={isSaving}
        />
      </form>
    </Form>
  );
};

export default NoteTags;
