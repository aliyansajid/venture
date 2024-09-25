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
import {
  fetchTeams,
  createProject,
  fetchClients,
} from "@/app/actions/projectActions";
import { useToast } from "../ui/use-toast";
import { Client, Project } from "@/types/next-auth";
import { Skeleton } from "../ui/skeleton";

interface Team {
  id: string;
  teamName: string;
}

const ProjectForm = ({
  projectId,
  project,
}: {
  projectId?: string;
  project?: Project;
}) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = projectSchema;
  const defaultValues = {
    ...(project ? project : {}),
    status: project?.status ?? undefined,
    budget: project?.budget ?? undefined,
    team: project?.teamId ?? "",
    client: project?.clientId ?? "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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

  useEffect(() => {
    const handleFetchClients = async () => {
      try {
        const result = await fetchClients();
        if (result.success && result.clients) {
          setClients(result.clients);
        } else {
          toast({
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "Failed to fetch clients.",
          variant: "destructive",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    handleFetchClients();
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
          {isDataLoading ? (
            <>
              <div className="flex flex-col sm:flex-row sm:gap-4 space-y-4 sm:space-y-0">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />

              <div className="flex flex-col sm:flex-row sm:gap-4 space-y-4 sm:space-y-0">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              {projectId ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <Skeleton className="h-10 w-full" />
              )}
            </>
          ) : (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="title"
                    label="Title"
                    placeholder="Enter project title"
                  />
                </div>
                <div className="flex-1">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="team"
                    label="Team"
                    placeholder="Select a team"
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
                label="Due Date"
                placeholder="Pick a date"
                className="w-full"
              />

              <div className="flex space-x-4">
                <div className="flex-1">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="priority"
                    label="Priority"
                    placeholder="Select priority level"
                  >
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                  </CustomFormField>
                </div>

                {projectId ? (
                  <div className="flex-1">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="status"
                      label="Status"
                      placeholder="Select a status"
                    >
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Revision">Revision</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </CustomFormField>
                  </div>
                ) : (
                  <div className="flex-1">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="client"
                      label="Client"
                      placeholder="Select a client"
                    >
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}
                        </SelectItem>
                      ))}
                    </CustomFormField>
                  </div>
                )}
              </div>

              {projectId && (
                <div className="flex-1">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="client"
                    label="Client"
                    placeholder="Select a client"
                  >
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>
              )}

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="budget"
                label="Budget"
                placeholder="Enter the budget"
              />

              <CustomButton
                type="submit"
                variant={ButtonVariant.DEFAULT}
                text={projectId ? "Update" : "Create Project"}
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full"
              />
            </>
          )}
        </form>
      </Form>
    </>
  );
};

export default ProjectForm;
