"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateInquiryStatusAction } from "@/app/admin/(dashboard)/actions";
import type { InquiryStatus } from "@/lib/inquiries";

const inquiryStatusOptions: readonly InquiryStatus[] = ["new", "contacted", "closed"];

const labels: Record<string, Record<InquiryStatus, string>> = {
  en: { new: "New", contacted: "Contacted", closed: "Closed" },
  es: { new: "Nueva", contacted: "Contactado", closed: "Cerrada" },
  ru: { new: "Новая", contacted: "На связи", closed: "Закрыта" },
  uk: { new: "Нова", contacted: "На зв'язку", closed: "Закрита" },
};

type InquiryStatusControlProps = {
  inquiryId: string;
  locale: string;
  status: InquiryStatus;
};

export function InquiryStatusControl({ inquiryId, locale, status }: InquiryStatusControlProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const localeLabels = labels[locale] ?? labels.en;

  function handleSelect(next: InquiryStatus) {
    if (next === status) {
      return;
    }

    startTransition(async () => {
      await updateInquiryStatusAction(inquiryId, next);
      router.refresh();
    });
  }

  return (
    <div className={`inquiry-status-control status-${status}`} role="group">
      {inquiryStatusOptions.map((option) => (
        <button
          aria-pressed={option === status}
          className={`inquiry-status-chip${option === status ? " is-active" : ""}`}
          disabled={isPending}
          key={option}
          onClick={() => handleSelect(option)}
          type="button"
        >
          {localeLabels[option]}
        </button>
      ))}
    </div>
  );
}
