"use client";

import { useState } from "react";
import { SubscribeFormFields } from "@/components/subscribe-form-fields";

export function SubscribeForm() {
  const [success, setSuccess] = useState<{ consentSms: boolean } | null>(null);

  if (success) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-[11px] tracking-[0.2em] uppercase mb-3 text-[#c4a35a]">
          ✦ WELCOME TO THE COMMUNITY
        </p>
        <h2 className="font-serif italic text-2xl text-[#f0eff8]">
          A welcome message is on its way{" "}
          <span className="text-[#c4a35a]">✦</span>
        </h2>
        <p className="font-sans text-sm text-[#8f8daa] mt-4 leading-relaxed">
          Check your inbox (and your spam folder, just in case).
          {success.consentSms && (
            <>
              <br />
              You will also receive an SMS confirmation shortly — reply{" "}
              <span className="font-mono">Y</span> to confirm.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <SubscribeFormFields
      source="subscribe_page"
      onSuccess={(result) => setSuccess({ consentSms: result.consentSms })}
    />
  );
}
