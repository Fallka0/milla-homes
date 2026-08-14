"use client";

import { useEffect, useRef, useState } from "react";

import type { ShareCopy } from "@/lib/share-copy";

type ShareReferenceProps = {
  copy: ShareCopy;
  reference: string;
};

// The reference is what a buyer quotes back on the phone, so it stays readable
// on the page and is one tap to copy. The <output> keeps the confirmation
// announced to screen readers without moving focus.
export function ShareReference({ copy, reference }: ShareReferenceProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reference);
    } catch {
      return;
    }

    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="share-reference">
      <span className="share-reference-label">{copy.reference.label}</span>
      <code className="share-reference-code">{reference}</code>
      <button
        aria-label={copy.reference.copy}
        className="share-reference-copy"
        onClick={handleCopy}
        type="button"
      >
        <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
          <rect height="13" rx="2" width="13" x="9" y="9" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>
      <output aria-live="polite" className={`share-reference-copied${copied ? " is-visible" : ""}`}>
        {copied ? copy.reference.copied : ""}
      </output>
    </div>
  );
}
