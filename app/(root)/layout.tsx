"use client";

import SearchForm from "@/components/forms/SearchForm";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userActions } from "@/data";
import { getInitials } from "@/lib/utils";
import { UserAction } from "@/types/next-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import Image from "next/image";
import router from "next/router";
import { useState } from "react";
import ModalDialog from "@/components/ModalDialog";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(null);

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleMenuItem = (menuItem: UserAction) => {
    if (menuItem.route) {
      router.push(menuItem.route);
    } else if (menuItem.action) {
      menuItem.action();
    } else {
      setModalContent({
        title: menuItem.modalTitle || "",
        description: menuItem.modalDescription || "",
      });
      setModalChildren(menuItem.component ? <menuItem.component /> : null);
      setIsModalOpen(true);
    }
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={session?.user.image || ""} />
                  <AvatarFallback>
                    {getInitials(session?.user?.name || "User")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {userActions.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => handleMenuItem(item)}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                    />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {isModalOpen && (
              <ModalDialog
                isOpen={isModalOpen}
                title={modalContent.title}
                description={modalContent.description}
                onClose={() => setIsModalOpen(false)}
              >
                {modalChildren}
              </ModalDialog>
            )}
            <MobileNav />
          </div>
        </div>

        {isSearchOpen && <SearchForm />}
      </div>
      <div className="flex-1">{children}</div>
    </main>
  );
}
