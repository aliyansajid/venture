"use client";

import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();

  return (
    <>
      <div>Id: {session?.user.id}</div>
      <div>Name: {session?.user.name}</div>
      <div>Email: {session?.user.email}</div>
      <div>Image: {session?.user.image}</div>
    </>
  );
};

export default Page;
