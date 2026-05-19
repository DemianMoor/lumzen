import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { Sidebar } from "@/components/sidebar";
import {
  StarField,
  NebulaBackground,
  LumGlowOrb,
} from "@/components/cosmic-background";
import { AudioPlayer } from "@/components/audio-player";
import { AudioPlayerProvider } from "@/lib/audio-player-context";

export const dynamic = "force-dynamic";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <AudioPlayerProvider>
      <div className="relative min-h-screen text-[#f0eff8]">
        <StarField />
        <NebulaBackground />
        <LumGlowOrb />

        <Sidebar />

        <div className="relative z-10 md:pl-[68px] pb-[120px]">{children}</div>

        <AudioPlayer />
      </div>
    </AudioPlayerProvider>
  );
}
