import { SignInCard } from "@/components/auth/SignInCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign In — MediLearn AI" };

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return <SignInCard />;
}
