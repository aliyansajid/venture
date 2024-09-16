import NextAuth from "next-auth";
import { Table } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string | null;
      image?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
}

export interface OTPFormProps {
  email: string;
  firstName: string;
}

export interface ModalDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children?: React.ReactNode;
}
