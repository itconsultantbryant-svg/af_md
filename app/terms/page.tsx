"use client";

import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { COMPANY_NAME, COMPANY_LEGAL, COMPANY_EMAIL, COMPANY_LOCATION } from "@/lib/brand";

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      label="Legal"
      title="Terms of Service"
      summary={`The terms that govern your use of the ${COMPANY_NAME} website, learning platform, and services. Please read them carefully before using our services.`}
      updated="October 2026"
    >
      <LegalSection heading="1. Agreement to These Terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement
          between you and {COMPANY_LEGAL} (&ldquo;{COMPANY_NAME}&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing our website,
          creating an account, enrolling in a course, or using any of our
          services, you agree to be bound by these Terms. If you do not agree,
          please do not use our services.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility & Accounts">
        <ul className="list-disc pl-5 space-y-2">
          <li>You must be at least 18 years old, or have guardian consent, to create an account.</li>
          <li>You agree to provide accurate, current, and complete information during registration.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.</li>
          <li>Notify us immediately at {COMPANY_EMAIL} if you suspect unauthorised access to your account.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Courses, Enrollments & Payments">
        <ul className="list-disc pl-5 space-y-2">
          <li>Course descriptions, schedules, durations, and prices are provided in good faith and may be updated.</li>
          <li>Enrollments may require approval and payment confirmation before access is granted.</li>
          <li>Where payment is required, you agree to pay the applicable fees using an accepted method.</li>
          <li>Seats are limited and allocated in accordance with our enrollment process.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Cancellations & Refunds">
        <p>
          Cancellation and refund eligibility depends on the course and the
          stage of delivery. Where a refund is due, we will process it using the
          original payment method or an agreed alternative. Please contact us
          before a course begins to discuss your options. Approved refunds are
          typically processed within a reasonable period.
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Use our services for any unlawful, harmful, or fraudulent purpose.</li>
          <li>Copy, resell, sublicense, or redistribute course materials without written permission.</li>
          <li>Attempt to gain unauthorised access to systems, data, or other users&apos; accounts.</li>
          <li>Upload malicious code or content that infringes the rights of others.</li>
          <li>Interfere with the normal operation, security, or integrity of our services.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. Intellectual Property">
        <p>
          All content on our website and platform — including text, graphics,
          logos, course materials, software, and code — is owned by or licensed
          to {COMPANY_LEGAL} and is protected by applicable intellectual
          property laws. Course materials are provided for your personal,
          non-transferable learning use only. Client-specific deliverables are
          governed by the applicable consulting agreement.
        </p>
      </LegalSection>

      <LegalSection heading="7. Third-Party Services">
        <p>
          Our services may include links to or integrations with third-party
          websites and tools. We are not responsible for the content, policies,
          or practices of third parties, and your use of them is at your own
          risk and subject to their terms.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disclaimers">
        <p>
          Our services are provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. While we strive for accuracy and reliability,
          we do not warrant that the services will be uninterrupted, error-free,
          or that learning outcomes or business results will meet your
          expectations. Course content is educational and does not constitute
          professional, legal, or financial advice.
        </p>
      </LegalSection>

      <LegalSection heading="9. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, {COMPANY_LEGAL} shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or for any loss of profits, data, or business
          opportunity, arising out of or relating to your use of our services.
          Our total liability for any claim shall not exceed the amount you paid
          us for the specific service giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection heading="10. Termination">
        <p>
          We may suspend or terminate your account or access to our services at
          any time if you breach these Terms or misuse our services. You may
          also close your account at any time. Provisions that by their nature
          should survive termination — such as intellectual property and
          liability terms — will continue to apply.
        </p>
      </LegalSection>

      <LegalSection heading="11. Governing Law">
        <p>
          These Terms are governed by the laws of the Republic of Liberia,
          where {COMPANY_LEGAL} is based ({COMPANY_LOCATION}). Any disputes shall
          be subject to the exclusive jurisdiction of the competent courts of
          Liberia, without prejudice to any mandatory consumer protections that
          apply in your country of residence.
        </p>
      </LegalSection>

      <LegalSection heading="12. Changes to These Terms">
        <p>
          We may revise these Terms from time to time. Continued use of our
          services after changes take effect constitutes acceptance of the
          revised Terms. The &ldquo;Last updated&rdquo; date above reflects the
          most recent revision.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
