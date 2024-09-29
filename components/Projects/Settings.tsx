import { useEffect, useState } from "react";
import { fetchProject, deleteProject } from "@/app/actions/projectActions";
import { fetchTeam } from "@/app/actions/teamActions";
import { Project, TeamMember } from "@/types/next-auth";
import { settingLinks } from "@/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import GeneralInformation from "@/components/Projects/GeneralInformation";
import Members from "@/components/Projects/Members";
import { useRouter } from "next/navigation";
import ModalDialog from "@/components/ModalDialog";
import CustomButton, { ButtonVariant } from "../CustomButton";
import Tags from "@/components/Projects/Tags";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "../ui/use-toast";

const Settings = ({
  projectId,
  project,
}: {
  projectId?: string;
  project?: Project;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLead, setTeamLead] = useState<any>([]);
  const [isTeamLoading, setIsTeamLoading] = useState(true);

  const handleFetchProject = async () => {
    try {
      if (projectId) {
        const result = await fetchProject(projectId);

        if (result.success) {
          const team = await fetchTeam(result.project?.teamId as string);
          if (team.success && team.team) {
            const teamLead = team.team.teamLead;
            const members = team.team.teamMembers.map((member: any) => ({
              ...member,
              image: member.image,
              role: member.role,
            }));

            setTeamLead(teamLead);
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
      setIsTeamLoading(false);
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

  return (
    <div className="flex">
      <nav className="w-60 border-r border-border-primary py-8 min-h-screen">
        {settingLinks.map((item) => {
          const isActive = activeSection === item.section;
          const isDelete = item.action === "deleteProject";
          return (
            <Link
              href={""}
              key={item.label}
              className={cn(
                "flex items-center mx-4 p-2 gap-3 mb-1 rounded-md",
                {
                  "bg-action-secondary-selected": isActive,
                  "text-red-base": isDelete,
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
                  "brightness-[0] invert-0": isActive && !isDelete,
                  "text-red-base": isDelete,
                })}
              />
              <p
                className={cn("text-sm font-medium", {
                  "text-dark-primary": isActive && !isDelete,
                  "text-dark-secondary": !isActive && !isDelete,
                  "text-red-base": isDelete,
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
        {activeSection === "members" && (
          <Members
            members={teamMembers}
            teamLead={teamLead}
            isLoading={isTeamLoading}
          />
        )}

        {activeSection === "tags" && projectId && (
          <Tags projectId={projectId} />
        )}

        {isModalOpen && (
          <ModalDialog
            isOpen={isModalOpen}
            title="Confirm Delete"
            description="Are you sure you want to delete this project? This action cannot be undone."
            onClose={() => setIsModalOpen(false)}
          >
            <div className="flex justify-end gap-2">
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
