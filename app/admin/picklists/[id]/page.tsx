import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PicklistDetailClient from "./PicklistDetailClient";

export default async function PicklistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    redirect("/login/admin");
  }

  return <PicklistDetailClient session={session} picklistId={id} />;
} 