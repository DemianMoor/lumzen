import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";
import { StarField, NebulaBackground } from "@/components/cosmic-background";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
      <StarField />
      <NebulaBackground />
      <Suspense fallback={null}>
        <VerifyEmailClient />
      </Suspense>
    </main>
  );
}
