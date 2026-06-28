import { COMPANY_NAME, COMPANY_URL, COMPANY_EMAIL, COMPANY_LOCATION } from "@/lib/brand";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: COMPANY_URL,
    logo: `${COMPANY_URL}/afrimind_logo.png`,
    description:
      `Africa's premier Tech & AI consulting agency, headquartered in ${COMPANY_LOCATION}.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Monrovia",
      addressRegion: "Montserrado County",
      addressCountry: "LR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: COMPANY_EMAIL,
      contactType: "customer service",
    },
    sameAs: [
      "https://linkedin.com",
      "https://twitter.com",
      "https://youtube.com",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
