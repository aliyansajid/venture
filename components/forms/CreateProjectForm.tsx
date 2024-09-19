"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import CustomButton, { ButtonVariant } from "@/components/CustomButton";
import { SelectItem } from "@/components/ui/select";
import { projectSchema } from "@/lib/utils";
import { fetchTeams, createProject } from "@/app/actions/projectActions";
import { useToast } from "../ui/use-toast";

interface Team {
  id: string;
  teamName: string;
}

const ProjectForm = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = projectSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const handleFetchTeams = async () => {
      try {
        const result = await fetchTeams();
        if (result.success && result.teams) {
          setTeams(result.teams);
        } else {
          toast({
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "Failed to fetch teams.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    handleFetchTeams();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const parsedValues = {
        ...values,
        budget: Number(values.budget),
      };
      const result = await createProject(parsedValues);

      if (result.success) {
        toast({
          description: result.message,
          variant: "default",
        });
        router.push(`/projects/${result.project?.id}`);
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex space-x-4">
            <div className="flex-1">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="title"
                label="Project Title"
                placeholder="Enter project title"
              />
            </div>
            <div className="flex-1">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="team"
                label="Assigned Team"
                placeholder="Select the team"
              >
                {teams.map((team, i) => (
                  <SelectItem key={team.teamName + i} value={team.id}>
                    {team.teamName}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
          </div>

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="dueDate"
            label="Project Deadline"
            placeholder="Select project deadline"
            className="w-full"
          />

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="priority"
            label="Project Priority"
            placeholder="Select priority level"
          >
            <SelectItem value="High">High Priority</SelectItem>
            <SelectItem value="Medium">Medium Priority</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
            <SelectItem value="Normal">Normal Priority</SelectItem>
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="budget"
            label="Project Budget"
            placeholder="Enter the budget"
          />

          <CustomButton
            type="submit"
            variant={ButtonVariant.DEFAULT}
            text="Create Project"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          />
        </form>
      </Form>
    </>
  );
};

export default ProjectForm;
