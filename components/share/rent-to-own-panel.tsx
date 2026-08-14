import { rentToOwnContent } from "@/lib/rent-to-own";
import type { ShareLocale } from "@/lib/share-property";

type RentToOwnPanelProps = {
  locale: ShareLocale;
};

// Native <details>/<summary>: collapsible with zero JavaScript, keyboard
// accessible for free, and the text is still in the DOM when collapsed so it is
// findable with the browser's in-page search.
export function RentToOwnPanel({ locale }: RentToOwnPanelProps) {
  const content = rentToOwnContent[locale];

  return (
    <details className="share-rto">
      <summary className="share-rto-summary">
        <span className="share-rto-heading">{content.heading}</span>
        <span aria-hidden="true" className="share-rto-chevron" />
      </summary>

      <div className="share-rto-body">
        <p className="share-rto-intro">{content.intro}</p>

        <ol className="share-rto-steps">
          {content.steps.map((step) => (
            <li className="share-rto-step" key={step.title}>
              <h3 className="share-rto-step-title">{step.title}</h3>
              <p className="share-rto-step-body">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="share-rto-footnote">{content.footnote}</p>
      </div>
    </details>
  );
}
