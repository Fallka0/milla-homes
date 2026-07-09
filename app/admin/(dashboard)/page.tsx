import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { DashboardPendingTours } from "@/components/admin/dashboard-pending-tours";
import { InquiryStatusControl } from "@/components/admin/inquiry-status-control";
import { PropertyStatusForm } from "@/components/admin/property-status-form";
import { adminCopy, resolveAdminLocale } from "@/lib/admin-copy";
import { getAdminBookingCopy } from "@/lib/booking-copy";
import { getAdminBookings } from "@/lib/bookings";
import { getAdminInquiries } from "@/lib/inquiries";
import { formatOptionalPrice, formatPrice, getPropertyPreviewImageUrl } from "@/lib/property-shared";
import { getAdminProperties } from "@/lib/properties";
import { getAdminSiteUrl } from "@/lib/site-urls";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const locale = resolveAdminLocale(cookieStore.get("verdant-locale")?.value);
  const copy = adminCopy[locale];
  const bookingCopy = getAdminBookingCopy(locale);
  const [properties, inquiries, bookings] = await Promise.all([
    getAdminProperties(),
    getAdminInquiries(),
    getAdminBookings(),
  ]);
  const pendingTours = bookings.filter((booking) => booking.type === "tour" && booking.status === "pending");
  const liveProperties = properties.filter(
    (property) => property.status === "available" || property.status === "reserved",
  );
  const draftProperties = properties.filter((property) => property.status === "draft");
  const featuredProperties = properties.filter((property) => property.featured);

  return (
    <section className="admin-grid">
      <div className="admin-dashboard-hero">
        <div>
          <p className="eyebrow">{copy.dashboard.heroEyebrow}</p>
          <h2>{copy.dashboard.heroTitle(properties.length)}</h2>
          <p>{copy.dashboard.heroBody}</p>
        </div>
        <div className="admin-quick-actions">
          <Link className="button button-primary" href="/admin/properties/new">
            {copy.dashboard.actions.newListing}
          </Link>
          <Link className="button button-secondary" href="/properties">
            {copy.dashboard.actions.viewPublicSite}
          </Link>
        </div>
      </div>

      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <span>{copy.dashboard.stats.public}</span>
          <strong>{liveProperties.length}</strong>
          <p>{copy.dashboard.stats.publicBody}</p>
        </article>
        <article className="admin-stat-card">
          <span>{copy.dashboard.stats.featured}</span>
          <strong>{featuredProperties.length}</strong>
          <p>{copy.dashboard.stats.featuredBody}</p>
        </article>
        <article className="admin-stat-card">
          <span>{copy.dashboard.stats.drafts}</span>
          <strong>{draftProperties.length}</strong>
          <p>{copy.dashboard.stats.draftsBody}</p>
        </article>
      </div>

      {pendingTours.length > 0 ? (
        <DashboardPendingTours
          bookingsHref={getAdminSiteUrl("/admin/bookings")}
          copy={bookingCopy}
          locale={locale}
          tours={pendingTours}
        />
      ) : null}

      <div className="admin-card admin-table-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">{copy.dashboard.listingsEyebrow}</p>
            <h2>{copy.dashboard.listingsTitle}</h2>
          </div>
        </div>

        {properties.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{copy.dashboard.table.listing}</th>
                  <th>{copy.dashboard.table.status}</th>
                  <th>{copy.dashboard.table.type}</th>
                  <th>{copy.dashboard.table.location}</th>
                  <th>{copy.dashboard.table.price}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="admin-listing-cell">
                        <div className="admin-listing-thumb">
                          <Image src={getPropertyPreviewImageUrl(property) ?? "/logos/verdant-seal.svg"} alt="" fill sizes="72px" />
                        </div>
                        <div className="admin-listing-title">
                          <strong>{property.title}</strong>
                          <span>
                            {property.referenceCode} / {property.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <PropertyStatusForm copy={copy} property={property} />
                    </td>
                    <td>{copy.typeLabels[property.type]}</td>
                    <td>{property.location}</td>
                    <td>
                      <strong>
                        {property.listingMode === "rent"
                          ? [
                              formatOptionalPrice(property.rentPriceEuro) ?? "—",
                              property.rentPricePeriod
                                ? copy.form.rentPricePeriodLabels[property.rentPricePeriod]
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" ")
                          : formatPrice(property.priceEuro)}
                      </strong>
                    </td>
                    <td>
                      <Link className="table-link" href={`/admin/properties/${property.id}`}>
                        {copy.form.editEyebrow}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <h3>{copy.dashboard.emptyTitle}</h3>
            <p>{copy.dashboard.emptyBody}</p>
            <Link className="button button-primary" href="/admin/properties/new">
              {copy.dashboard.actions.createFirst}
            </Link>
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">{copy.dashboard.inquiries.eyebrow}</p>
            <h2>{copy.dashboard.inquiries.title}</h2>
          </div>
        </div>

        {inquiries.length > 0 ? (
          <div className="admin-inquiry-list">
            {inquiries.map((inquiry) => {
              const subject = inquiry.propertyTitle
                ? `Re: ${inquiry.propertyTitle}`
                : "Re: Milla Homes inquiry";
              const replyBody = [
                `Hello ${inquiry.name},`,
                "",
                "Thank you for your inquiry.",
                "",
                inquiry.propertyTitle ? `Property: ${inquiry.propertyTitle}` : "",
                inquiry.timeline ? `Preferred viewing time: ${inquiry.timeline}` : "",
                "",
                "Kind regards,",
                "Milla Homes",
              ]
                .filter(Boolean)
                .join("\n");

              return (
                <article className={`admin-inquiry-card inquiry-${inquiry.status}`} key={inquiry.id}>
                  <div className="admin-inquiry-topline">
                    <strong>{inquiry.name}</strong>
                    <span>{new Date(inquiry.createdAt).toLocaleString(locale)}</span>
                  </div>
                  <InquiryStatusControl inquiryId={inquiry.id} locale={locale} status={inquiry.status} />
                  <div className="admin-inquiry-meta">
                    <span><strong>{copy.dashboard.inquiries.property}:</strong> {inquiry.propertyTitle ?? "General inquiry"}</span>
                    <span><strong>{copy.dashboard.inquiries.email}:</strong> {inquiry.email}</span>
                    {inquiry.phone ? <span><strong>{copy.dashboard.inquiries.phone}:</strong> {inquiry.phone}</span> : null}
                    {inquiry.timeline ? <span><strong>{copy.dashboard.inquiries.preferredTime}:</strong> {inquiry.timeline}</span> : null}
                  </div>
                  <p className="admin-inquiry-message">
                    <strong>{copy.dashboard.inquiries.message}:</strong> {inquiry.message}
                  </p>
                  <div className="admin-inquiry-actions">
                    <a
                      className="button button-secondary"
                      href={`mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(replyBody)}`}
                    >
                      {copy.dashboard.inquiries.reply}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <p>{copy.dashboard.inquiries.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
