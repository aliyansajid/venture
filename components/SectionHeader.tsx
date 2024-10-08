"use client";

const SectionHeader = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="border-b border-border-primary h-[69px] flex items-center justify-between px-4 lg:px-8">
      <h1 className="text-2xl text-dark-primary font-medium">{title}</h1>
      {children && <div className="flex gap-4">{children}</div>}
    </div>
  );
};

export default SectionHeader;
