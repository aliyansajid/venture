"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import CustomButton, { ButtonVariant } from "@/components/CustomButton";
import { SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { taskSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamMember, Task } from "@/types/next-auth";
import { useEffect, useState } from "react";
import { fetchProject } from "@/app/actions/projectActions";
import { fetchTeam } from "@/app/actions/teamActions";
import { useToast } from "../ui/use-toast";
import Image from "next/image";
import { createTask, updateTask } from "@/app/actions/taskActions";
import { Skeleton } from "../ui/skeleton";

const TaskForm = ({ projectId, task }: { projectId: string; task?: Task }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const formSchema = taskSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title,
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      priority: task?.priority,
      assignedTo: task?.assignee.id,
      status: task?.status || "",
      description: task?.description || "",
    },
  });

  const handleFetchProject = async () => {
    try {
      if (projectId) {
        const result = await fetchProject(projectId);

        if (result.success) {
          const team = await fetchTeam(result.project?.teamId as string);
          if (team.success && team.team) {
            const members = team.team.teamMembers.map((member: any) => ({
              ...member,
              image: member.image,
              role: member.role,
            }));
            setTeamMembers(members);
          } else {
            setTeamMembers([]);
          }
        }
      }
    } catch (error) {
      toast({
        description: "Failed to fetch project or team.",
        variant: "destructive",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProject();
  }, [projectId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const result = task
        ? await updateTask(task.id, values)
        : await createTask(values, projectId);

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
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {isDataLoading ? (
          <>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <div className="flex space-x-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="title"
              label="Title"
              placeholder="Enter task title"
            />

            <div className="flex space-x-4">
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="dueDate"
                  label="Due Date"
                  placeholder="Pick a date"
                  className="w-full"
                />
              </div>

              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="assignedTo"
                  label="Assign to"
                  placeholder="Select assignee"
                  className="w-full"
                >
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={member.image as string}
                          alt={`${member.firstName}'s profile`}
                          width={24}
                          height={24}
                          className="object-cover w-6 h-6 rounded-full"
                        />
                        <span>{`${member.firstName} ${member.lastName}`}</span>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>
            </div>

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

              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="status"
                  label="Status"
                  placeholder="Select status"
                >
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </CustomFormField>
              </div>
            </div>

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter task description"
              className="w-full"
            />

            <CustomButton
              type="submit"
              variant={ButtonVariant.DEFAULT}
              text={task ? "Update Task" : "Create Task"}
              className="w-full"
              isLoading={isLoading}
            />
          </>
        )}
      </form>
    </Form>
  );
};

export default TaskForm;
