"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/data";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const MobileNav = () => {
  const pathName = usePathname();

  return (
    <section className="block lg:hidden w-full h-6">
      <Sheet>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent className="bg-background-secondary flex flex-col justify-between">
          <div>
            <Link
              href="/"
              className="flex cursor-pointer items-center gap-3 pb-6 mb-6 border-b border-border-primary"
            >
              <Image src="/images/logo.svg" alt="Logo" width={28} height={24} />
              <h1 className="text-xl text-dark-primary font-medium">Venture</h1>
            </Link>
            <div>
              <SheetClose asChild>
                <nav className="flex h-full flex-col text-black">
                  {sidebarLinks.map((item) => {
                    const isActive =
                      pathName === item.route ||
                      pathName.startsWith(`${item.route}/`);

                    return (
                      <SheetClose asChild key={item.route}>
                        <Link
                          href={item.route}
                          key={item.label}
                          className={cn(
                            "flex items-center p-2 gap-3 mb-2 rounded-md",
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
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetClose>
            </div>
          </div>

          <div className="border-t border-border-primary pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-background-tertiary text-dark-primary text-sm font-medium flex items-center justify-center">
                M
              </div>
              <span className="text-sm text-dark-primary font-medium">
                Marketing Team&apos;s
              </span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
