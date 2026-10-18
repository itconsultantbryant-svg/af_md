"use client";

import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { COMPANY_NAME, COMPANY_LEGAL, COMPANY_EMAIL } from "@/lib/brand";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Privacy Policy"
      summary={`How ${COMPANY_NAME} collects, uses, stores, and protects your personal information across our website, learning platform, and consulting services.`}
      updated="October 2026"
    >
      <LegalSection heading="1. Who We Are">
        <p>
          {COMPANY_LEGAL} (&ldquo;{COMPANY_NAME}&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an AI and technology
          consulting agency headquartered in Monrovia, Liberia. We provide
          custom AI solutions, enterprise software, and professional training.
          This policy explains how we handle personal data in line with
          internationally recognised privacy principles, including the GDPR
          where it applies.
        </p>
        <p>
          If you have questions about this policy or your data, contact us at{" "}
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="text-brand-gold hover:underline"
          >
            {COMPANY_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Account details</strong> — your
            name, email address, phone number, organisation, job title,
            country, and password (stored only as a secure hash).
          </li>
          <li>
            <strong className="text-white">Training &amp; enrollment data</strong>{" "}
            — courses you enroll in, progress, exam scores, certificates, and
            information you provide in enrollment forms such as your motivation
            or emergency contact.
          </li>
          <li>
            <strong className="text-white">Service &amp; enquiry data</strong> —
            information you submit through contact forms, demo requests, and
            newsletter subscriptions.
          </li>
          <li>
            <strong className="text-white">Usage &amp; analytics data</strong> —
            anonymised visitor and session identifiers, pages viewed, referrers,
            approximate session duration, and interactions such as chat opens.
          </li>
          <li>
            <strong className="text-white">Technical data</strong> — browser and
            device information collected automatically to keep the service
            secure and functioning.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-2">
          <li>To create and manage your account and deliver our services.</li>
          <li>To process course enrollments, track learning, and issue certificates.</li>
          <li>To respond to enquiries, demo requests, and support needs.</li>
          <li>To send updates you have opted into, such as newsletters (you may unsubscribe at any time).</li>
          <li>To understand how our website is used and improve our products and content.</li>
          <li>To detect, prevent, and address security, fraud, or abuse issues.</li>
          <li>To comply with applicable legal and regulatory obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Legal Bases for Processing">
        <p>
          Where the GDPR applies, we rely on: your <em>consent</em> (for
          newsletters and non-essential cookies), <em>performance of a
          contract</em> (to provide courses and services you requested), our{" "}
          <em>legitimate interests</em> (to secure and improve our services),
          and <em>legal obligation</em> where we must retain certain records.
        </p>
      </LegalSection>

      <LegalSection heading="5. Sharing & Disclosure">
        <p>
          We do not sell your personal information. We share data only with
          trusted service providers that help us operate — for example,
          cloud hosting, database, file storage, and email delivery providers —
          and only to the extent necessary. We may also disclose information
          where required by law, to protect our rights, or in connection with a
          merger or acquisition.
        </p>
      </LegalSection>

      <LegalSection heading="6. Data Retention">
        <p>
          We retain personal data only for as long as necessary to fulfil the
          purposes described here, including to meet legal, accounting, and
          reporting requirements. Account and enrollment records are kept while
          your account is active and for a reasonable period afterwards for
          record-keeping. Analytics data is retained in aggregate form.
        </p>
      </LegalSection>

      <LegalSection heading="7. Security">
        <p>
          We apply appropriate technical and organisational measures to protect
          your data, including encrypted transport, hashed passwords, access
          controls, and restricted administrative access. No method of
          transmission or storage is completely secure, but we work
          continuously to safeguard your information.
        </p>
      </LegalSection>

      <LegalSection heading="8. International Transfers">
        <p>
          Our infrastructure and service providers may process data in
          jurisdictions outside your own, including the United States. Where we
          transfer personal data internationally, we take steps to ensure it
          receives an adequate level of protection.
        </p>
      </LegalSection>

      <LegalSection heading="9. Your Rights">
        <p>
          Depending on your location, you may have the right to access,
          correct, delete, restrict, or object to the processing of your
          personal data, and to receive a portable copy. You may also withdraw
          consent at any time. To exercise these rights, email{" "}
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="text-brand-gold hover:underline"
          >
            {COMPANY_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="10. Children's Privacy">
        <p>
          Our services are intended for adults and organisations. We do not
          knowingly collect personal data from children without appropriate
          consent from a parent or guardian.
        </p>
      </LegalSection>

      <LegalSection heading="11. Changes to This Policy">
        <p>
          We may update this policy from time to time. Material changes will be
          reflected by the &ldquo;Last updated&rdquo; date above and, where
          appropriate, communicated to you directly.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
