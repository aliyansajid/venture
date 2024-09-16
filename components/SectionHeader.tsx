"use client";

import { SectionHeaderProps } from "@/types/next-auth";

const SectionHeader = ({ title, children }: SectionHeaderProps) => {
  return (
    <div className="border-b border-border-primary h-[69px] flex items-center justify-between px-8">
      <h1 className="text-2xl text-dark-primary font-medium">{title}</h1>
      {children && <div className="flex gap-4">{children}</div>}
    </div>
  );
};

export default SectionHeader;
