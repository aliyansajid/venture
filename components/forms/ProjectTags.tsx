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
import { fetchProject, updateProjectTags } from "@/app/actions/projectActions";
import { cva } from "class-variance-authority";

const tagVariants = cva(
  "bg-action-secondary-selected text-dark-primary text-sm font-medium px-3 py-1 gap-2 rounded-full flex items-center transition-transform ease-in-out duration-300",
  {
    variants: {
      animate: {
        true: "hover:-translate-y-1 hover:scale-110",
        false: "",
      },
    },
    defaultVariants: {
      animate: true,
    },
  }
);

const ProjectTags = ({ projectId }: { projectId: string }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        const result = await fetchProject(projectId);
        if (result.success) {
          setTags(result.project?.tags || []);
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
  }, [projectId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const value = inputValue.trim();

      if (value && value.length >= 3 && value.length <= 15 && tags.length < 3) {
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

  const onSubmit = async () => {
    setIsSaving(true);
    form.setValue("tags", tags);
    try {
      const result = await updateProjectTags(projectId, tags);

      if (result.success) {
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
        description: "Error saving tags.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded-md" />
        ) : (
          <>
            <div className="border border-interaction-outline-base p-1 min-h-10 h-auto rounded-md flex items-center flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className={tagVariants({ animate: true })}>
                  <span>{tag}</span>

                  <XCircle
                    size={14}
                    className="text-dark-secondary cursor-pointer"
                    onClick={() => handleRemoveTag(index)}
                  />
                </div>
              ))}
              {tags.length < 3 && (
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
          className="mt-5"
          disabled={isSaving || isLoading}
          isLoading={isSaving}
        />
      </form>
    </Form>
  );
};

export default ProjectTags;
