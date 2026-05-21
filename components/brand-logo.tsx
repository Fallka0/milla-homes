import Image from "next/image";

type BrandLogoProps = {
  priority?: boolean;
};

export function BrandLogo({ priority = false }: BrandLogoProps) {
  return (
    <span className="brand-logo-lockup">
      <Image
        className="brand-logo-image"
        src="/logos/mh-logo.svg"
        alt="Milla Homes"
        width={340}
        height={340}
        priority={priority}
      />
    </span>
  );
}
