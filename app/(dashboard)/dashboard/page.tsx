import { auth } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = { title: "Dashboard — MediLearn AI" };

export default async function DashboardPage() {
  const session = await auth();
  return <DashboardClient user={session!.user} />;
}
