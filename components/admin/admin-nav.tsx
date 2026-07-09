"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminNavItem = {
  external?: boolean;
  href: string;
  label: string;
};

type AdminNavProps = {
  ariaLabel: string;
  items: AdminNavItem[];
};

function hrefPathname(href: string) {
  try {
    return new URL(href).pathname;
  } catch {
    return href;
  }
}

export function AdminNav({ ariaLabel, items }: AdminNavProps) {
  const pathname = usePathname();

  function isActive(item: AdminNavItem) {
    if (item.external) {
      return false;
    }

    const path = hrefPathname(item.href);

    if (path === "/admin") {
      return pathname === "/admin";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <nav className="admin-nav" aria-label={ariaLabel}>
      {items.map((item) => {
        const active = isActive(item);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`admin-nav-link${active ? " is-active" : ""}`}
            href={item.href}
            key={item.href}
            {...(item.external ? { rel: "noreferrer", target: "_blank" } : {})}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
