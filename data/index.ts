import ProfileSetting from "@/components/forms/ProfileSetting";
import { signOut } from "next-auth/react";
import { Trash2, Tag } from "lucide-react";
import NoteTags from "@/components/forms/NotesTags";

export const sidebarLinks = [
  {
    label: "Dashboard",
    route: "/",
    icon: "/icons/ChartPie.svg",
  },
  {
    label: "Projects",
    route: "/projects",
    icon: "/icons/FolderOpen.svg",
  },
  {
    label: "Notes",
    route: "/notes",
    icon: "/icons/NoteBlank.svg",
  },
  {
    label: "Tasks",
    route: "/tasks",
    icon: "/icons/ClipboardText.svg",
  },
  {
    label: "Teams",
    route: "/teams",
    icon: "/icons/Users.svg",
  },
  {
    label: "Calendar",
    route: "/calendar",
    icon: "/icons/Calendar.svg",
  },
  {
    label: "Messages",
    route: "/messages",
    icon: "/icons/ChatCircleDots.svg",
  },
  {
    label: "Settings",
    route: "/settings",
    icon: "/icons/Gear.svg",
  },
];

export const userActions = [
  {
    label: "Profile",
    icon: "/icons/UserCircle.svg",
    modalTitle: "Profile",
    modalDescription: "View and edit your profile information.",
    component: ProfileSetting,
  },
  {
    label: "Account Settings",
    icon: "/icons/Gear2.svg",
    modalTitle: "Account Settings",
    modalDescription:
      "Manage your account settings including security and preferences.",
  },
  {
    label: "Help & Support",
    icon: "/icons/Question.svg",
    modalTitle: "Help & Support",
    modalDescription: "Get assistance and find answers to your questions.",
  },
  {
    label: "Log Out",
    icon: "/icons/SignOut.svg",
    action: () => signOut({ callbackUrl: "/" }),
  },
];

export const noteActions = [
  {
    label: "Add Tags",
    icon: Tag,
    modalTitle: "Manage Tags",
    modalDescription: "Organize your note by adding relevant tags.",
    component: NoteTags,
  },
  {
    label: "Delete",
    icon: Trash2,
    action: "deleteNote",
    modalTitle: "Confirm Deletion",
    modalDescription: "Are you sure you want to permanently delete this note?",
  },
];
