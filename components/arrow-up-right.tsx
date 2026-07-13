type ArrowUpRightProps = {
  className?: string;
};

// U+2197 renders as an emoji on iOS, so external/forward links use this SVG
// arrow instead of the raw character.
export function ArrowUpRight({ className }: ArrowUpRightProps) {
  return (
    <span aria-hidden className={["arrow-up-right", className].filter(Boolean).join(" ")}>
      <svg fill="none" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </span>
  );
}
