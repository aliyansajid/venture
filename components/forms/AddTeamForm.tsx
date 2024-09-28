"use client";

import React, { useEffect, useState } from "react";
import CustomButton, { ButtonVariant } from "../CustomButton";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "../ui/form";
import { teamSchema } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MultiSelect } from "@/components/MultiSelect";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { TeamMember } from "@/types/next-auth";
import { createTeam, updateTeam, fetchTeam } from "@/app/actions/teamActions";
import { fetchTeamData } from "@/app/actions/teamActions";

const AddTeamForm = ({
  teamId,
  onSuccess,
}: {
  teamId?: string;
  onSuccess?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(!!teamId);
  const [teamLeads, setTeamLeads] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const { toast } = useToast();

  const formSchema = teamSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const handleFetchTeamData = async () => {
      try {
        const result = await fetchTeamData();
        if (result.success) {
          setTeamLeads(result.teamLeads || []);
          setTeamMembers(result.teamMembers || []);
        } else {
          toast({
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          description: "Failed to fetch users.",
          variant: "destructive",
        });
      }
    };

    handleFetchTeamData();

    if (teamId) {
      const handleFetchTeam = async () => {
        try {
          const teamData = await fetchTeam(teamId);

          if (teamData.success && teamData.team) {
            form.reset({
              teamName: teamData.team.teamName,
              teamLead: teamData.team.teamLead?.id,
              teamMembers: teamData.team.teamMembers.map(
                (member: any) => member.id
              ),
              description: teamData.team.description ?? "",
            });
          } else {
            toast({
              description: teamData.message,
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            description: "Failed to load team data.",
            variant: "destructive",
          });
        } finally {
          setIsDataLoading(false);
        }
      };

      handleFetchTeam();
    }
  }, [teamId, form, toast]);

  const teamLeadOptions = teamLeads.map((lead) => ({
    label: `${lead.firstName} ${lead.lastName}`,
    value: lead.id,
    profileImage: lead.image || "/icons/UserCircle.svg",
  }));

  const teamMemberOptions = teamMembers.map((member) => ({
    label: `${member.firstName} ${member.lastName}`,
    value: member.id,
    profileImage: member.image || "/icons/UserCircle.svg",
  }));

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isLoading) return;
    setIsLoading(true);

    try {
      let result;
      if (teamId) {
        result = await updateTeam(teamId, values);
      } else {
        result = await createTeam(values);
      }

      toast({
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (onSuccess && result.success) {
        onSuccess();
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
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="teamName"
                  label="Team Name"
                  placeholder="Enter Team Name"
                />
              </div>
              <div className="flex-1">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="teamLead"
                  label="Select Team Lead"
                  placeholder="Select an Option"
                  className="max-h-52"
                >
                  {teamLeadOptions.map((lead) => (
                    <SelectItem key={lead.value} value={lead.value}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={lead.profileImage}
                          alt={lead.label}
                          width={24}
                          height={24}
                          className="object-cover w-6 h-6 rounded-full"
                        />
                        <span>{lead.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>
            </div>

            <MultiSelect
              label="Select Team Members"
              options={teamMemberOptions}
              onValueChange={(selectedMembers) =>
                form.setValue("teamMembers", selectedMembers)
              }
              defaultValue={form.getValues("teamMembers") || []}
              placeholder="Choose members"
              maxCount={1}
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="description"
              label="Description"
              placeholder="Add a description for the team"
            />

            <CustomButton
              variant={ButtonVariant.DEFAULT}
              text={teamId ? "Update Team" : "Create Team"}
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </>
        )}
      </form>
    </Form>
  );
};

export default AddTeamForm;
