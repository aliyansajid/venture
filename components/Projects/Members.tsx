import { TeamMember } from "@/types/next-auth";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Members = ({
  teamLead,
  members,
  isLoading,
}: {
  teamLead: any;
  members: TeamMember[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-medium">Members</h2>
        <ul className="pl-0">
          <li className="flex justify-between items-center gap-3 mb-3 pb-3 border-b border-border-primary last:border-b-0">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="w-24 h-6 mb-2" />
                <Skeleton className="w-36 h-4" />
              </div>
            </div>
            <Skeleton className="w-20 h-5 rounded-full" />
          </li>

          {[...Array(3)].map((_, index) => (
            <li
              key={index}
              className="flex justify-between items-center gap-3 mb-3 pb-3 border-b border-border-primary last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-24 h-6 mb-2" />
                  <Skeleton className="w-36 h-4" />
                </div>
              </div>
              <Skeleton className="w-20 h-5 rounded-full" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-medium">Members</h2>
      <ul className="pl-0">
        <li
          key={teamLead.id}
          className="flex justify-between items-center gap-3 mb-3 pb-3 border-b border-border-primary last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={teamLead.image} />
              <AvatarFallback className="text-base">
                {getInitials(`${teamLead.firstName} ${teamLead.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{`${teamLead.firstName} ${teamLead.lastName}`}</p>
              <p className="text-sm text-dark-secondary">{teamLead.email}</p>
            </div>
          </div>
          <div>
            <Badge variant={"default"}>{teamLead.role}</Badge>
          </div>
        </li>

        {members?.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center gap-3 mb-3 pb-3 border-b border-border-primary last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.image as string} />
                <AvatarFallback className="text-base">
                  {getInitials(`${member.firstName} ${member.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{`${member.firstName} ${member.lastName}`}</p>
                <p className="text-sm text-dark-secondary">{member.email}</p>
              </div>
            </div>
            <div>
              <Badge variant={"default"}>{member.role}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
