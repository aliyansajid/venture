import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 flex items-center justify-center">
        <Image
          src="/images/team-meeting-collaboration.jpg"
          alt="Team meeting with charts and laptop"
          width={1920}
          height={1280}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto py-20 px-8">{children}</div>
      </div>
    </div>
  );
}
