import { ProjectCardProps } from "@/types/next-auth";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import Link from "next/link";
import Image from "next/image";
import { tagColors } from "@/lib/utils";
import { Calendar, ListTodo } from "lucide-react";

const ProjectCard = ({
  id,
  title,
  tags,
  dueDate,
  client,
  completedTasks,
  totalTasks,
  teamMembers = [],
}: ProjectCardProps) => {
  const getTagColor = (index: number) => tagColors[index % tagColors.length];
  const displayedMembers = teamMembers?.slice(0, 3) ?? [];
  const remainingMembers = teamMembers?.length
    ? teamMembers.length - displayedMembers.length
    : 0;

  const tooltipItems = displayedMembers.map((member, index) => ({
    id: index,
    name: `${member.firstName} ${member.lastName}`,
    designation: member.role ?? "Unknown Role",
    image: member.image ?? "/icons/UserCircle.svg",
  }));

  return (
    <Link href={`/projects/${id}`} passHref>
      <div className="cursor-pointer bg-background-primary border border-border-primary rounded-md space-y-3 px-6 py-4 max-w-md hover:shadow transition-shadow duration-200">
        {tags.length > 0 && (
          <div className="flex items-center gap-3">
            {tags.map((tag, index) => {
              const color = getTagColor(index);
              return (
                <span
                  key={index}
                  className={`text-xs font-medium px-1.5 py-1 rounded ${color.bg} ${color.text}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        <h3 className="text-lg font-medium text-dark-primary">{title}</h3>
        <div className="flex justify-between">
          <p className="flex items-center gap-2 text-sm text-dark-secondary font-normal overflow-hidden">
            <Calendar size={16} />
            Due on&nbsp;
            {new Date(dueDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="flex items-center gap-2 text-sm text-dark-secondary font-normal overflow-hidden">
            <ListTodo size={16} />
            {completedTasks}/{totalTasks}
          </p>
        </div>

        <div className="flex justify-between items-center border-t border-border-primary pt-3">
          <AnimatedTooltip items={tooltipItems} size={26} />
          {remainingMembers > 0 && (
            <div className="relative flex items-center justify-center w-[24px] h-[24px] rounded-full bg-action-secondary-selected text-sm border-2 border-white">
              +{remainingMembers}
            </div>
          )}
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <Image
                src="/icons/Attachment.svg"
                alt="Attachment"
                width={16}
                height={16}
              />
              <span className="text-sm text-dark-secondary">0</span>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/icons/Chat.svg"
                alt="Attachment"
                width={16}
                height={16}
              />
              <span className="text-sm text-dark-secondary">0</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
