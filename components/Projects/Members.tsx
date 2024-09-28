import React from "react";
import { TeamMember } from "@/types/next-auth";
import Image from "next/image";

const Members = ({ members }: { members: TeamMember[] }) => {
  return (
    <div>
      <h2 className="text-xl font-medium">Members</h2>
      <ul className="pl-0">
        {members?.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-3 mb-3 pb-3 border-b border-border-primary last:border-b-0"
          >
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
