import { ProjectCardProps } from "@/types/next-auth";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import Link from "next/link";
import Image from "next/image";

const ProjectCard = ({
  id,
  title,
  dueDate,
  client,
  completedTasks,
  totalTasks,
  teamMembers = [],
}: ProjectCardProps) => {
  const displayedMembers = teamMembers?.slice(0, 3) ?? [];
  const remainingMembers = teamMembers?.length
    ? teamMembers.length - displayedMembers.length
    : 0;

  const tooltipItems = displayedMembers.map((member, index) => ({
    id: index,
    name: `${member.firstName} ${member.lastName}`,
    designation: member.role ?? "Unknown Role",
    image: member.image ?? "/default-avatar.png",
  }));

  return (
    <Link href={`/projects/${id}`} passHref>
      <div className="cursor-pointer bg-background-primary border border-border-primary rounded-md space-y-4 px-4 py-4 max-w-md hover:shadow transition-shadow duration-200">
        <h3 className="text-lg font-medium text-dark-primary">{title}</h3>
        <div className="flex justify-between">
          <p className="flex gap-2 text-sm text-dark-secondary font-normal overflow-hidden">
            <Image src="/icons/Date.svg" alt="Date" width={16} height={16} />
            Due on{" "}
            {new Date(dueDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="flex gap-2 text-sm text-dark-secondary font-normal overflow-hidden">
            <Image
              src="/icons/Checklist.svg"
              alt="Checklist"
              width={16}
              height={16}
            />
            {completedTasks}/{totalTasks}
          </p>
        </div>

        <div className="flex justify-between items-center border-t border-border-primary pt-4">
          <AnimatedTooltip items={tooltipItems} />

          {remainingMembers > 0 && (
            <div className="relative flex items-center justify-center w-[24px] h-[24px] rounded-full bg-action-secondary-selected text-sm border-2 border-white">
              +{remainingMembers}
            </div>
          )}
          <div className="flex gap-3">
            <div>
              <Image
                src="/icons/Attachment.svg"
                alt="Attachment"
                width={16}
                height={16}
              />
            </div>
            <div>
              <Image
                src="/icons/Chat.svg"
                alt="Attachment"
                width={16}
                height={16}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
