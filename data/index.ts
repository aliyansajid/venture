import ProfileSetting from "@/components/forms/ProfileSetting";
import { signOut } from "next-auth/react";
import NoteTags from "@/components/forms/NotesTags";
import TaskForm from "@/components/forms/TaskForm";

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
    icon: "/icons/Tag.svg",
    modalTitle: "Manage Tags",
    modalDescription: "Organize your note by adding relevant tags.",
    component: NoteTags,
  },
  {
    label: "Delete",
    icon: "/icons/Trash.svg",
    action: "deleteNote",
    modalTitle: "Confirm Delete",
    modalDescription:
      "Are you sure you want to delete this note? This action cannot be undone.",
  },
];

export const settingLinks = [
  {
    label: "General",
    section: "general",
    icon: "/icons/Info.svg",
  },
  {
    label: "Members",
    section: "members",
    icon: "/icons/Users.svg",
  },
  {
    label: "Tags",
    section: "tags",
    icon: "/icons/Tag.svg",
  },
  {
    label: "Delete",
    action: "deleteProject",
    icon: "/icons/Trash.svg",
  },
];

export const taskActions = [
  {
    label: "Edit",
    icon: "/icons/PencilSimple.svg",
    modalTitle: "Edit Task",
    modalDescription: "Modify the task details below.",
    component: TaskForm,
  },
  {
    label: "Delete",
    icon: "/icons/Trash.svg",
    action: "deleteTask",
    modalTitle: "Confirm Delete",
    modalDescription:
      "Are you sure you want to delete this task? This action cannot be undone.",
  },
];
