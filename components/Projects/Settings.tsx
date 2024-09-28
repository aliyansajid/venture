import React, { useEffect, useState } from "react";
import { fetchProject, deleteProject } from "@/app/actions/projectActions";
import { fetchTeam } from "@/app/actions/teamActions";
import { Project, TeamUser } from "@/types/next-auth";
import { settingLinks } from "@/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import GeneralInformation from "@/components/Projects/GeneralInformation";
import Members from "@/components/Projects/Members";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import ModalDialog from "@/components/ModalDialog";
import CustomButton, { ButtonVariant } from "../CustomButton";
import Tags from "@/components/Projects/Tags";

const Settings = ({
  projectId,
  project,
}: {
  projectId?: string;
  project?: Project;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [teamMembers, setTeamMembers] = useState<TeamUser[]>([]);

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
    }
  };

  useEffect(() => {
    handleFetchProject();
  }, [projectId]);

  const handleDeleteProject = async () => {
    setIsLoading(true);
    try {
      const result = await deleteProject(projectId as string);

      if (result.success) {
        toast({
          description: result.message,
          variant: "default",
        });
        setIsModalOpen(false);
        router.push("/projects");
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Error deleting the project.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuItem = (item: any) => {
    if (item.action === "deleteProject") {
      setIsModalOpen(true);
    } else {
      setActiveSection(item.section);
    }
  };

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
              onClick={() => handleMenuItem(item)}
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
        {activeSection === "tags" && projectId && (
          <Tags projectId={projectId} />
        )}

        {isModalOpen && (
          <ModalDialog
            isOpen={isModalOpen}
            title="Delete Project"
            description="Are you sure you want to delete this project? This action cannot be undone."
            onClose={() => setIsModalOpen(false)}
          >
            <div className="flex justify-end space-x-4">
              <CustomButton
                variant={ButtonVariant.DEFAULT}
                text="Cancel"
                onClick={() => setIsModalOpen(false)}
              />
              <CustomButton
                variant={ButtonVariant.DESTRUCTIVE}
                text="Delete"
                onClick={async () => {
                  await handleDeleteProject();
                }}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </ModalDialog>
        )}
      </div>
    </div>
  );
};

export default Settings;
