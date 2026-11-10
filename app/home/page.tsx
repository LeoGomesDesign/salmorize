import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { fetchHomeData } from "@/lib/supabase/home-queries";
import HomeScreen from "@/app/features/game/components/home/HomeScreen";

type HomePageProps = {
  searchParams: Promise<{ account?: string | string[] }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient();
  const { account } = await searchParams;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    redirect("/");
  }

  const data = await fetchHomeData(supabase);
  const accountStatus =
    account === "linked" || account === "error" ? account : undefined;

  return (
    <HomeScreen
      initialData={data}
      isAnonymous={user.is_anonymous ?? false}
      accountStatus={accountStatus}
    />
  );
}
