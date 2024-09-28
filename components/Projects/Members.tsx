import React from "react";
import { TeamMember } from "@/types/next-auth";
import Image from "next/image";
import { Badge } from "../ui/badge";

const Members = ({
  teamLead,
  members,
}: {
  teamLead: any;
  members: TeamMember[];
}) => {
  return (
    <div>
      <h2 className="text-xl font-medium">Members</h2>
      <ul className="pl-0">
        <li
          key={teamLead.id}
          className="flex justify-between items-center gap-3 mb-3 pb-3 border-b border-border-primary last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <Image
              src={teamLead.image || "/icons/UserCircle.svg"}
              alt={teamLead.firstName}
              height={40}
              width={40}
              className="rounded-full h-10 w-10"
            />
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
              <Image
                src={member.image || "/icons/UserCircle.svg"}
                alt={member.firstName}
                height={40}
                width={40}
                className="rounded-full h-10 w-10"
              />
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
