import { createSupabaseServerClient } from "@/lib/supabase";
import { NatalClient } from "./natal-client";
import type { ComputedChart } from "@/lib/astrology/ephemeris";

export const dynamic = "force-dynamic";

export default async function NatalPage() {
  const supabase = await createSupabaseServerClient();

  const { data: chart } = await supabase
    .from("natal_charts")
    .select("*")
    .maybeSingle();

  return (
    <main className="relative min-h-[calc(100vh-60px)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="text-center mb-12">
          <p className="font-display text-[11px] tracking-[0.2em] uppercase text-[#c4a35a] mb-3">
            ✦ CELESTIAL TOOLS
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#f0eff8] mb-3">
            The cosmos has always been speaking
          </h1>
          <p className="font-serif italic text-lg text-[#8f8daa]">
            Bring your birth data. Receive your chart — patterns, not predictions.
          </p>
        </header>

        <NatalClient
          existing={
            chart
              ? {
                  name: chart.name,
                  birthDate: chart.birth_date,
                  birthTime: chart.birth_time,
                  birthCity: chart.birth_city,
                  sunSign: chart.sun_sign,
                  moonSign: chart.moon_sign,
                  risingSign: chart.rising_sign,
                  chartData: chart.chart_data as ComputedChart | null,
                  aiInterpretation: chart.ai_interpretation,
                }
              : null
          }
        />
      </div>
    </main>
  );
}
