"use client";

import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";
import { COMPANY_NAME, COMPANY_EMAIL } from "@/lib/brand";

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Cookie Policy"
      summary={`This policy explains how ${COMPANY_NAME} uses cookies and similar technologies on our website and learning platform, and the choices available to you.`}
      updated="October 2026"
    >
      <LegalSection heading="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a
          website. They help a site remember your actions and preferences over
          time. We also use related technologies such as local storage and
          anonymous identifiers, which are covered by this policy.
        </p>
      </LegalSection>

      <LegalSection heading="2. How We Use Cookies">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Strictly necessary cookies</strong> —
            required to operate the site, keep you signed in, and secure your
            session. These cannot be switched off through our platform.
          </li>
          <li>
            <strong className="text-white">Analytics cookies</strong> — help us
            understand how visitors use the site, such as which pages are
            viewed and how long sessions last, using anonymised identifiers.
          </li>
          <li>
            <strong className="text-white">Preference cookies</strong> — remember
            choices you make, such as your cookie preferences or interface
            settings.
          </li>
          <li>
            <strong className="text-white">Functionality cookies</strong> — support
            features such as our site assistant and learning progress tracking.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Cookies We Set">
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-left text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">afrimind_session</td>
                <td className="px-4 py-3">Keeps you securely signed in</td>
                <td className="px-4 py-3">Essential</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">visitor key</td>
                <td className="px-4 py-3">Anonymised visit and session analytics</td>
                <td className="px-4 py-3">Analytics</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">preferences</td>
                <td className="px-4 py-3">Remembers your interface choices</td>
                <td className="px-4 py-3">Preference</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection heading="4. Third-Party Cookies">
        <p>
          Some features may rely on third-party providers such as hosting,
          content delivery, or analytics services, which may set their own
          cookies. We do not control those cookies; please refer to the relevant
          provider&apos;s policy for details.
        </p>
      </LegalSection>

      <LegalSection heading="5. Managing Cookies">
        <p>
          You can control or delete cookies through your browser settings. You
          can typically block cookies entirely, delete existing cookies, or set
          your browser to notify you when a cookie is set. Please note that
          disabling strictly necessary cookies may prevent you from signing in
          or using core parts of the site.
        </p>
      </LegalSection>

      <LegalSection heading="6. Do Not Track">
        <p>
          Some browsers offer a &ldquo;Do Not Track&rdquo; signal. There is no
          common industry standard for interpreting these signals, so our site
          does not currently respond to them. You can manage analytics through
          your browser cookie controls.
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes &amp; Contact">
        <p>
          We may update this Cookie Policy from time to time. Material changes
          will be reflected by the &ldquo;Last updated&rdquo; date above. For
          any questions about our use of cookies, email{" "}
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="text-brand-gold hover:underline"
          >
            {COMPANY_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
