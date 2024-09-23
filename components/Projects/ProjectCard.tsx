import { ProjectCardProps } from "@/types/next-auth";
import { AnimatedTooltip } from "../ui/animated-tooltip";

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
    <div className="bg-white shadow-md rounded-lg p-4 relative border border-gray-200">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          {client && client.image ? (
            <img
              src={client.image}
              alt="Client Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          )}
        </div>
      </div>

      <h2 className="text-center text-lg font-semibold">{title}</h2>
      <p className="text-center text-gray-500 text-sm mb-4">
        Due to: {new Date(dueDate).toLocaleDateString()}
      </p>

      <div className="flex justify-center mb-4">
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          UI, UX Design
        </span>
      </div>

      <div className="flex justify-center items-center mt-4">
        <AnimatedTooltip items={tooltipItems} />

        {remainingMembers > 0 && (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center -ml-2 text-sm text-gray-600">
            +{remainingMembers}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-400 rounded-b-lg"></div>
    </div>
  );
};

export default ProjectCard;
