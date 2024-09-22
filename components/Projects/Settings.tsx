import React, { useEffect, useState } from "react";
import { fetchProject } from "@/app/actions/projectActions";
import { fetchTeam } from "@/app/actions/teamActions";
import { ProjectFormProps, TeamMember } from "@/types/next-auth";
import { settingLinks } from "@/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import GeneralInformation from "@/components/Projects/GeneralInformation";
import Members from "@/components/Projects/Members";
import { toast } from "../ui/use-toast";

const Settings = ({ projectId, project }: ProjectFormProps) => {
  const [activeSection, setActiveSection] = useState("general");
  const [teamMembers, setTeamMembers] = useState<TeamMember[] | null>(null);

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
            setTeamMembers(members ?? null);
          } else {
            setTeamMembers(null);
          }
        }
      }
    } catch (error) {
      toast({
        description: "Failed to fetch project or team.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    handleFetchProject();
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex">
      <nav className="border-r border-border-primary py-8 min-h-screen">
        {settingLinks.map((item) => {
          const isActive = activeSection === item.section;
          return (
            <Link
              href={""}
              key={item.label}
              className={cn(
                "flex items-center mx-4 p-2 gap-3 mb-1 rounded-md",
                {
                  "bg-action-secondary-selected": isActive,
                }
              )}
              onClick={() => setActiveSection(item.section)}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={cn({
                  "brightness-[0] invert-0": isActive,
                })}
              />
              <p
                className={cn("text-sm font-medium", {
                  "text-dark-primary": isActive,
                  "text-dark-secondary": !isActive,
                })}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="w-3/4 p-8">
        {activeSection === "general" && projectId && project && (
          <GeneralInformation projectId={projectId} project={project} />
        )}
        {activeSection === "members" && teamMembers && (
          <Members members={teamMembers} />
        )}
      </div>
    </div>
  );
};

export default Settings;
