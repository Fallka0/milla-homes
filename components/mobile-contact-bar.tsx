"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getPhoneHref, getWhatsAppHref } from "@/lib/contact";

type MobileContactBarProps = {
  callLabel: string;
  contactLabel: string;
  whatsappLabel: string;
  whatsappMessage: string;
};

export function MobileContactBar({ callLabel, contactLabel, whatsappLabel, whatsappMessage }: MobileContactBarProps) {
  const pathname = usePathname();
  const [footerVisible, setFooterVisible] = useState(false);
  const [formFocused, setFormFocused] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)), { rootMargin: "0px 0px 40px" });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      setFormFocused(target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']"));
    };
    const handleFocusOut = () => setFormFocused(false);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav aria-label={contactLabel} className="mobile-contact-bar" data-hidden={footerVisible || formFocused}>
      <Link href={getPhoneHref()}>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.25.56 3.4.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A16.8 16.8 0 0 1 3 4.2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.17.2 2.3.56 3.4a1 1 0 0 1-.25 1Z" /></svg>
        <span>{callLabel}</span>
      </Link>
      <Link href={getWhatsAppHref(whatsappMessage)} rel="noreferrer" target="_blank">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.3 23.5l6-1.6A11.7 11.7 0 0 0 12 23h.01A11.8 11.8 0 0 0 20.5 3.5Zm-8.5 17.5a9.7 9.7 0 0 1-5-1.4l-.35-.2-3.55.95.95-3.45-.22-.36A9.75 9.75 0 1 1 12 21Zm5.35-7.3c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.36-1.45a8.8 8.8 0 0 1-1.64-2.04c-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45 0 1.44 1.06 2.84 1.2 3.04.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.11.56-.08 1.75-.72 2-1.4.24-.68.24-1.26.17-1.39-.07-.12-.27-.2-.56-.34Z" /></svg>
        <span>{whatsappLabel}</span>
      </Link>
      <Link href="/contact">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v9a2.5 2.5 0 0 1-2.5 2.5H9l-5.2 4v-4.7A2.5 2.5 0 0 1 3 14.5Zm2 0v9c0 .28.22.5.5.5h.3v1.9L8.3 15h10.2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5Z" /></svg>
        <span>{contactLabel}</span>
      </Link>
    </nav>
  );
}
