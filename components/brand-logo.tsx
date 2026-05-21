import Image from "next/image";

type BrandLogoProps = {
  priority?: boolean;
};

export function BrandLogo({ priority = false }: BrandLogoProps) {
  return (
    <span className="brand-logo-lockup">
      <Image
        className="brand-logo-image"
        src="/logos/mh-logo.png"
        alt="Milla Homes"
        width={1254}
        height={1254}
        priority={priority}
      />
    </span>
  );
}
