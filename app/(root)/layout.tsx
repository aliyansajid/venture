import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-background-secondary p-4 shadow-md">
          <Image src="/images/logo.svg" alt="Logo" width={28} height={24} />
          <div className="h-6">
            <MobileNav />
          </div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </main>
  );
}
