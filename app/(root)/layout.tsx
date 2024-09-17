"use client";

import SearchForm from "@/components/forms/SearchForm";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <div className="lg:hidden bg-background-secondary p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between ">
          <Image src="/images/logo.svg" alt="Logo" width={28} height={24} />

          <div className="flex items-center gap-2">
            <div
              onClick={handleSearchClick}
              className="min-w-8 min-h-8 rounded-full bg-background-tertiary text-dark-primary text-sm font-medium 
              flex items-center justify-center cursor-pointer"
            >
              <Image
                src="/icons/MagnifyingGlass.svg"
                alt="Search Icon"
                width={20}
                height={20}
              />
            </div>

            <div
              className="min-w-8 min-h-8 rounded-full bg-background-tertiary text-dark-primary text-sm font-medium 
              flex items-center justify-center cursor-pointer"
            >
              <Image
                src="/icons/Bell.svg"
                alt="Bell Icon"
                width={20}
                height={20}
              />
            </div>

            <Avatar>
              <AvatarImage src={session?.user.image || ""} />
              <AvatarFallback>
                {getInitials(session?.user?.name || "User")}
              </AvatarFallback>
            </Avatar>

            <MobileNav />
          </div>
        </div>

        {isSearchOpen && <SearchForm />}
      </div>
      <div className="flex-1">{children}</div>
    </main>
  );
}
