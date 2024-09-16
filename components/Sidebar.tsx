"use client";

import { sidebarLinks } from "@/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathName = usePathname();

  return (
    <nav className="hidden lg:flex w-60 bg-background-secondary border-r border-border-primary flex-col min-h-screen justify-between">
      <div>
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 px-7 py-5 mb-5 border-b border-border-primary"
        >
          <Image src="/images/logo.svg" alt="Logo" width={28} height={24} />
          <h1 className="text-xl text-dark-primary font-medium">Venture</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathName === item.route || pathName.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex items-center mx-4 p-2 gap-3 mb-1 rounded-md",
                {
                  "bg-action-secondary-selected": isActive,
                }
              )}
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
      </div>

      <div className="border-t border-border-primary px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-background-tertiary text-dark-primary text-sm font-medium flex items-center justify-center">
            M
          </div>
          <span className="text-sm text-dark-primary font-medium">
            Marketing Team&apos;s
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
