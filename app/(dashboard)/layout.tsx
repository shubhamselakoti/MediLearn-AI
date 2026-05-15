import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 240 }}>
        <Navbar user={session.user} />
        <main className="flex-1 p-6 max-w-screen-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
