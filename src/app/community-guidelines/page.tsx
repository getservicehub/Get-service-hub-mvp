import { LEGAL_VERSIONS, LEGAL_EFFECTIVE_DATE } from "@/lib/legal/versions";

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[760px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Community, Reviews &amp; Content Policy</h1>
        <p className="text-xs text-muted2 mb-1">Integrity rules for GetServiHub and GetServiHub Pro</p>
        <p className="text-xs text-muted2 mb-10">Effective Date: {LEGAL_EFFECTIVE_DATE} · Version: {LEGAL_VERSIONS.community}</p>

        <div className="space-y-6 text-sm text-muted2 leading-relaxed">
          <p>This Policy supplements the Terms of Service. It applies to reviews, ratings, comments, posts, Gallery content, service descriptions, professional profiles, portfolio material, messages, reports, and other user-generated content.</p>

          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Core Principle</h2>
            <p>GetServiHub is designed to help people make decisions using authentic information. Users may disagree, criticize, describe bad experiences, or respond to criticism, but they may not fabricate experiences, manipulate reputation systems, impersonate others, or use the Platform to harass or deceive.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Reviews Must Reflect Genuine Experience</h2>
            <p>A review or rating presented as a customer experience must be based on the reviewer&apos;s genuine experience with the provider or service being reviewed. Do not review a business you did not use, create fake accounts, use AI or another person to fabricate a customer experience, or coordinate reviews to distort a rating.</p>
            <p className="mt-2">GetServiHub may use signals such as service relationships, account history, timing, technical indicators, reports, or other evidence to investigate authenticity, but a displayed review is not a guarantee that GetServiHub independently verified every underlying fact.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Incentives and Material Connections</h2>
            <p>Do not offer money, discounts, gifts, free services, refunds, or other benefits on the condition that a person post a positive review, negative review, particular star rating, or particular sentiment.</p>
            <p className="mt-2">Where an honest review is incentivized without conditioning sentiment, any disclosure required by law must be clear and conspicuous. Employees, owners, managers, agents, relatives, business partners, or others with a material connection must not present themselves as ordinary independent customers where that would be misleading.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. No Review Suppression or Retaliation</h2>
            <p>Providers may respond to criticism and may report reviews they reasonably believe violate policy or law. They may not use threats, intimidation, harassment, retaliation, or knowingly baseless legal threats to suppress legitimate negative reviews.</p>
            <p className="mt-2">GetServiHub does not remove a review merely because it is unfavorable. Reviews may be removed or restricted for reasons such as fraud, fake experience, conflicts of interest, harassment, unlawful content, privacy violations, extortion, spam, irrelevance, impersonation, intellectual-property violations, or other policy violations.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Honest Negative Reviews Are Allowed</h2>
            <p>Users may describe genuine negative experiences and opinions. Reviews should focus on the service experience and avoid unnecessary personal attacks, discriminatory slurs, threats, doxxing, or publication of sensitive personal information.</p>
            <p className="mt-2">Statements of fact should be truthful to the best of the reviewer&apos;s knowledge. Opinions should not be presented as fabricated factual events.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Provider Responses</h2>
            <p>Providers may respond professionally to reviews, provide context, state disagreement, or explain how an issue was addressed. Responses must comply with the same rules against harassment, threats, discrimination, privacy violations, and deceptive claims.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Gallery, Portfolio, and Project Images</h2>
            <p>Only upload images and project materials you have the right to use. Providers must not represent another business&apos;s work, stock imagery, AI-generated work, or unrelated projects as their own completed work in a misleading manner.</p>
            <p className="mt-2">If people, private homes, license plates, documents, addresses, or other identifying information appear in content, the uploader is responsible for having appropriate rights and for considering privacy and safety before publication.</p>
            <p className="mt-2">Where a Gallery post is linked to a service, service information such as &quot;Starting at $X&quot; describes the linked service&apos;s advertised starting price and does not represent the actual price of the photographed project unless the Platform expressly provides a verified project-price feature.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Professional Claims</h2>
            <p>Professional profiles and listings must not contain materially false or misleading claims about licenses, education, certifications, bar membership, professional designations, awards, years of experience, insurance, completed work, specialties, client results, or affiliations.</p>
            <p className="mt-2">Professionals remain responsible for advertising and ethical rules applicable to their profession and jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Prohibited Content</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Threats, credible incitement of violence, harassment, stalking, or targeted abuse.</li>
              <li>Hateful or unlawfully discriminatory content or service restrictions.</li>
              <li>Sexual exploitation, non-consensual intimate content, or content involving exploitation of minors.</li>
              <li>Doxxing, passwords, financial credentials, government identification numbers, or other highly sensitive private information.</li>
              <li>Fraud, phishing, scams, malware, counterfeit credentials, or instructions designed to facilitate wrongdoing against users or the Platform.</li>
              <li>Copyright, trademark, publicity, privacy, or other rights violations.</li>
              <li>Spam, repetitive solicitation, irrelevant promotional content, or manipulation of engagement metrics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">10. Reporting and Moderation</h2>
            <p>Users may report listings, reviews, comments, profiles, or other content using available reporting tools or by contacting support. A report does not guarantee removal. GetServiHub may review context, request information, preserve evidence, restrict visibility, remove content, suspend accounts, or take no action depending on the circumstances and applicable law.</p>
            <p className="mt-2">Submitting knowingly false or abusive reports to harm another user is prohibited.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">11. Trust and Verification Integrity</h2>
            <p>Users may not forge, alter, transfer, sell, rent, or manipulate verification status, trust badges, VerTrust signals, review history, response metrics, membership history, or other trust indicators.</p>
            <p className="mt-2">GetServiHub may revoke or correct trust indicators when information changes or cannot be verified. Trust indicators do not replace a user&apos;s own due diligence.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">12. Sponsored Content and Paid Visibility</h2>
            <p>Paid visibility, sponsored placement, or subscription level must not be represented as an independent customer review or as proof of superior quality. GetServiHub may label paid or sponsored placements and may maintain separate quality/trust signals.</p>
            <p className="mt-2">Providers may not obscure or misrepresent a sponsorship disclosure.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">13. Enforcement</h2>
            <p>Depending on severity, history, risk, and context, GetServiHub may warn a user, remove or restrict content, remove trust indicators, limit features, suspend an account, terminate an account, preserve information for investigation, or refer matters to appropriate authorities where legally permitted.</p>
            <p className="mt-2">Enforcement decisions may consider safety, fraud, manipulation, repeat violations, and evidence available to GetServiHub.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">14. Appeals and Corrections</h2>
            <p>Where GetServiHub provides an appeal or correction mechanism, users should submit relevant evidence and accurate information. GetServiHub may correct factual platform data without removing a legitimate user opinion merely because the provider disagrees with it.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">15. Contact</h2>
            <p>Policy/reporting support: support@getservihub.com</p>
            <p>Legal/general inquiries: hello@getservihub.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}
