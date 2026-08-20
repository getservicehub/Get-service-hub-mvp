import type { Metadata } from "next";
import { LEGAL_VERSIONS, LEGAL_EFFECTIVE_DATE } from "@/lib/legal/versions";

export const metadata: Metadata = {
  title: "Privacy Policy | GetServiHub",
  description: "How GetServiHub and GetServiHub Pro collect, use, and protect your information across the platform.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[760px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted2 mb-1">GetServiHub and GetServiHub Pro</p>
        <p className="text-xs text-muted2 mb-10">Effective Date: {LEGAL_EFFECTIVE_DATE} · Version: {LEGAL_VERSIONS.privacy}</p>

        <div className="space-y-6 text-sm text-muted2 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Scope</h2>
            <p>This Policy applies to GetServiHub and GetServiHub Pro websites and platform features, including registration, profiles, services, posts, images, Gallery, reviews, comments, messaging, favorites, follows, likes, reports, analytics/events, provider tools, and Pro applications and profiles.</p>
            <p className="mt-2">It does not govern independent providers&apos; own privacy practices or third-party websites and services that operate under their own policies.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Information We Collect</h2>
            <p className="font-semibold text-white mt-2 mb-1">A. Account and profile information</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address, full name, role/account type, phone number, city, avatar or profile image.</li>
              <li>Business name, business hours, service information, descriptions, portfolio and listing information.</li>
              <li>License number and verification-related status where a provider supplies such information.</li>
              <li>Account creation and update timestamps and administrative/account status information.</li>
            </ul>
            <p className="font-semibold text-white mt-3 mb-1">B. GetServiHub Pro information</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Application information such as full name, email, specialty interest, and application message.</li>
              <li>Professional profile information such as biography, avatar, years of experience, specialties, identity-verification status, license-verification status, completed-job information, reviews, and professional statistics where those features are used.</li>
            </ul>
            <p className="font-semibold text-white mt-3 mb-1">C. Content and communications</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conversations and messages exchanged through Platform messaging.</li>
              <li>Reviews, ratings, comments, reports, post content, service descriptions, photographs, post images, service photos, and other User Content.</li>
            </ul>
            <p className="font-semibold text-white mt-3 mb-1">D. Activity and preference information</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Favorites, follows, likes, interactions with listings/posts, impressions, clicks, and contact-related events recorded by Platform analytics.</li>
            </ul>
            <p className="font-semibold text-white mt-3 mb-1">E. Technical information</p>
            <p>When you use the Platform, GetServiHub and its service providers may process device, browser, network, IP-address, log, error, diagnostic, performance, session, and similar technical information needed to host, secure, debug, monitor, and operate the Platform. Sentry is currently used for error and technical monitoring, and Vercel provides hosting infrastructure.</p>
            <p className="font-semibold text-white mt-3 mb-1">F. Information we do not currently collect through an integrated payment processor</p>
            <p>As of this version, Stripe is not integrated and GetServiHub does not represent that it collects payment-card information for third-party service transactions through an integrated GetServiHub checkout. This Policy should be updated before a payment processor or subscription checkout is launched.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Create and manage accounts, profiles, services, posts, applications, and professional profiles.</li>
              <li>Provide search, discovery, Gallery, messaging, reviews, comments, follows, favorites, reports, and related features.</li>
              <li>Operate verification, trust, ranking, relevance, fraud-prevention, safety, moderation, and platform-integrity functions.</li>
              <li>Provide provider analytics and measure impressions, clicks, contacts, and feature performance.</li>
              <li>Respond to support, legal, privacy, and safety requests.</li>
              <li>Debug, secure, monitor, maintain, and improve the Platform.</li>
              <li>Prevent fraud, abuse, impersonation, manipulation, security incidents, and violations of our policies.</li>
              <li>Comply with law, enforce agreements, establish or defend legal claims, and protect users and the public.</li>
              <li>Develop and test new features using appropriately controlled data and safeguards.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. How Information Is Disclosed</h2>
            <p>We may disclose personal information as reasonably necessary for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Other users: profile, listing, service, portfolio, review, rating, comment, and other information you intentionally make public or share through Platform features.</li>
              <li>Messaging counterparties: information you choose to share in a conversation and basic account/context information needed to support the conversation.</li>
              <li>Service providers: infrastructure, hosting, authentication, database, storage, realtime, security, error monitoring, and other vendors processing information on our behalf. Current confirmed providers include Supabase, Vercel, and Sentry.</li>
              <li>Legal and safety: authorities, courts, advisers, or other parties when reasonably necessary to comply with law, respond to valid process, protect rights or safety, investigate fraud, or enforce agreements.</li>
              <li>Business transfers: a buyer, investor, lender, successor, or adviser in connection with a financing, merger, acquisition, restructuring, bankruptcy, sale, or diligence process, subject to appropriate safeguards.</li>
            </ul>
            <p className="mt-2">GetServiHub does not state in this draft that it sells personal information or shares personal information for cross-context behavioral advertising. If product practices change, this Policy and any legally required opt-out mechanisms must be updated before or when those practices begin.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Public Information</h2>
            <p>Provider and professional profiles, business names, service information, portfolio images, posts, reviews, ratings, comments, and other information designed to be public may be visible to users or visitors and may be indexed or copied by search engines or third parties. Do not publish information you do not want publicly associated with your profile or business.</p>
            <p className="mt-2">Private messages are not intended to be public, but may be accessed or disclosed as needed for operation, safety, legal compliance, abuse investigation, or with the participants&apos; direction, subject to applicable law.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Verification and Sensitive Documents</h2>
            <p>If GetServiHub collects identity, license, credential, or other verification information, it will use that information for verification, fraud prevention, trust, safety, compliance, and related purposes. The Platform should minimize collection and retention of sensitive verification materials and should not publicly display underlying identity documents.</p>
            <p className="mt-2">The product team must confirm actual verification vendors, sources, document retention, and access controls before expanding this section or representing a particular verification method.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Cookies and Similar Technologies</h2>
            <p>The Platform and its infrastructure providers may use cookies, local storage, session technologies, logs, and similar technologies necessary for authentication, security, preferences, functionality, diagnostics, and analytics. The product should maintain an accurate inventory of non-essential analytics or advertising technologies and implement any consent or opt-out controls required by applicable law.</p>
            <p className="mt-2">This draft does not claim the use of advertising cookies or cross-site behavioral advertising because that was not established by the audit.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Data Retention</h2>
            <p>GetServiHub retains personal information for as long as reasonably necessary for the purposes described in this Policy, including account operation, user-requested services, trust and safety, fraud prevention, dispute handling, legal compliance, enforcement, security, and legitimate business records.</p>
            <p className="mt-2">Retention periods may vary by data type. Account deletion does not necessarily require immediate deletion of every record where retention is reasonably necessary or legally permitted, for example to preserve transaction/dispute records, security logs, fraud evidence, legal claims, or the integrity of reviews and moderation records.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Security</h2>
            <p>GetServiHub uses administrative, technical, and organizational measures intended to protect information, including access controls and security features provided through its infrastructure. No system is completely secure, and GetServiHub cannot guarantee absolute security.</p>
            <p className="mt-2">Users are responsible for protecting account credentials and should promptly report suspected unauthorized access.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">10. Your Choices and Privacy Requests</h2>
            <p>Subject to applicable law, users may request access to, correction of, or deletion of certain personal information and may have additional rights depending on their jurisdiction. Requests may currently be submitted to hello@getservihub.com. GetServiHub may need to verify the requester&apos;s identity before fulfilling a request.</p>
            <p className="mt-2">A deletion request may be denied or limited where retention is permitted or required for security, fraud prevention, legal obligations, dispute resolution, exercise or defense of legal claims, or other lawful exceptions.</p>
            <div className="mt-3 border border-amber-400/30 bg-amber-400/5 rounded-lg p-3 text-xs text-amber-300">Implementation required: There is currently no in-product account deletion or data export function. Establish an operational privacy-request workflow, response ownership, identity-verification method, and recordkeeping before publicizing automated controls.</div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">11. California Privacy</h2>
            <p>California law may provide residents with privacy rights depending on the law that applies to GetServiHub and, for certain statutes, whether the operator meets statutory applicability thresholds. Regardless of threshold status, this Policy is intended to describe the categories of personal information collected and the purposes for which it is used.</p>
            <p className="mt-2">Where applicable, California residents may have rights to know/access, correct, delete, obtain information about certain disclosures, and opt out of certain sale/sharing practices, as well as rights against unlawful discrimination for exercising privacy rights. GetServiHub will honor rights required by applicable law after appropriate verification.</p>
            <p className="mt-2">GetServiHub should reassess California Consumer Privacy Act applicability as the business grows, especially revenue, data-volume, and sale/sharing thresholds, and should implement required notices, request methods, metrics, contractual terms, and opt-out signals if and when applicable.</p>
            <p className="mt-2">California&apos;s online privacy rules also require commercial online services collecting personally identifiable information from California consumers to conspicuously post a privacy policy describing specified practices. This Policy should remain linked conspicuously from the Platform.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">12. Do Not Track / Global Privacy Signals</h2>
            <p>The product audit did not establish a specific Do Not Track or Global Privacy Control implementation. Before publication, counsel and engineering should confirm the Platform&apos;s actual response to browser signals and add any disclosure or technical behavior required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">13. Children</h2>
            <p>The Platform is intended for adults age 18 and older and is not directed to children. GetServiHub does not knowingly permit children under 18 to create accounts. If we learn that an ineligible minor has provided personal information through an account, we may disable the account and take appropriate steps regarding the information, subject to law.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">14. International Users</h2>
            <p>The Platform is currently oriented to the United States and San Diego-area marketplace. If you access the Platform from another jurisdiction, your information may be processed in the United States or other locations where service providers operate. Expansion outside the United States should trigger a separate privacy and cross-border compliance review.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">15. Changes to This Policy</h2>
            <p>Each published Privacy Policy must display a fixed effective date and version. We may update this Policy to reflect product, legal, or operational changes. Material changes should be communicated as required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">16. Contact</h2>
            <p>Privacy/general inquiries: hello@getservihub.com</p>
            <p>Support: support@getservihub.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}
