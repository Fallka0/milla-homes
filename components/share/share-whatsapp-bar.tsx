import { formatShareTemplate, type ShareCopy } from "@/lib/share-copy";

type ShareWhatsAppBarProps = {
  copy: ShareCopy;
  phone: string;
  reference: string;
  title: string;
};

export function buildShareWhatsAppHref(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

// Sticky footer action. A plain anchor, server-rendered, so it works before any
// JavaScript loads — this is the one thing on the page that must never fail.
export function ShareWhatsAppBar({ copy, phone, reference, title }: ShareWhatsAppBarProps) {
  const message = formatShareTemplate(copy.whatsapp.message, { reference, title });

  return (
    <div className="share-whatsapp-bar">
      <div className="share-whatsapp-inner">
        <div className="share-whatsapp-copy">
          <span className="share-whatsapp-prompt">{copy.whatsapp.stickyPrompt}</span>
          <span className="share-whatsapp-reference">{reference}</span>
        </div>
        <a
          className="share-whatsapp-action"
          href={buildShareWhatsAppHref(phone, message)}
          rel="noreferrer"
          target="_blank"
        >
          <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.8l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.8a12 12 0 0 0 4.6 4.3c1.7.8 2.4.9 3.2.8.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.1-.5-.2Z" />
          </svg>
          <span>{copy.whatsapp.action}</span>
        </a>
      </div>
    </div>
  );
}
