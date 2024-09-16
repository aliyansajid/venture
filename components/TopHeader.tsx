"use client";
import Image from "next/image";
import SearchForm from "./forms/SearchForm";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { userActions } from "@/data";
import ModalDialog from "@/components/ModalDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { UserAction } from "@/types/next-auth";
import { getInitials } from "@/lib/utils";

const TopHeader = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
  });
  const [modalChildren, setModalChildren] = useState<React.ReactNode>(null);

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
    <div className="border-b border-border-primary h-[68.5px] flex items-center justify-between px-8">
      <SearchForm />
      <div className="relative flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className="w-8 h-8 rounded-full bg-background-tertiary text-dark-primary text-sm font-medium 
              flex items-center justify-center cursor-pointer"
              >
                <Image
                  src="/icons/Bell.svg"
                  alt="Bell Icon"
                  width={20}
                  height={20}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {status === "loading" ? (
          <>
            <Skeleton className="w-[32px] h-[32px] rounded-full" />
            <Skeleton className="w-[100px] h-[20px] rounded-md" />
          </>
        ) : (
          <>
            <Avatar>
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {getInitials(session?.user?.name || "User")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-dark-primary font-medium">
              {session?.user?.name || "User"}
            </span>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center focus:outline-none">
              <Image
                src="/icons/CaretDown.svg"
                alt="Caret Down"
                width={16}
                height={16}
              />
            </button>
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
      </div>

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
    </div>
  );
};

export default TopHeader;
