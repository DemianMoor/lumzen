import { redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import {
  StarField,
  NebulaBackground,
  LumGlowOrb,
} from "@/components/cosmic-background";

export const dynamic = "force-dynamic";

function timeBasedGreeting(hour: number, name: string) {
  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Good morning, ${name}`,
      subtitle: "The light is already within you.",
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      greeting: `Good afternoon, ${name}`,
      subtitle: "Stillness is available right now.",
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      greeting: `Good evening, ${name}`,
      subtitle: "The stars are beginning to listen.",
    };
  }
  return {
    greeting: `Rest well, ${name}`,
    subtitle: "Your practice continues in your dreams.",
  };
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const admin = createSupabaseAdmin();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ||
    (user.email ? user.email.split("@")[0] : "traveler");

  const hour = new Date().getHours();
  const { greeting, subtitle } = timeBasedGreeting(hour, displayName);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
      <StarField />
      <NebulaBackground />
      <LumGlowOrb />

      <div className="relative z-10 max-w-2xl text-center">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-4 text-[#c4a35a]">
          ✦ LUMZEN
        </p>
        <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-4 leading-tight">
          {greeting} <span className="text-[#c4a35a]">✦</span>
        </h1>
        <p className="font-serif italic text-lg text-[#8f8daa] mb-8">
          {subtitle}
        </p>
        <p className="font-sans text-sm text-[#8f8daa]">
          Your sanctuary is being prepared.
        </p>
      </div>
    </main>
  );
}
