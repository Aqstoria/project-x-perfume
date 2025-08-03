import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PicklistPickClient from "./PicklistPickClient";

export default async function PicklistPickPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/login/admin");
  }

  return <PicklistPickClient session={session} picklistId={id} />;
} 