import type { Metadata } from "next";
import { LEGAL_VERSIONS, LEGAL_EFFECTIVE_DATE } from "@/lib/legal/versions";

export const metadata: Metadata = {
  title: "Terms of Service | GetServiHub",
  description: "Terms of Service governing GetServiHub and GetServiHub Pro, including accounts, listings, messaging, reviews, and platform use.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[760px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-xs text-muted2 mb-1">GetServiHub and GetServiHub Pro</p>
        <p className="text-xs text-muted2 mb-1">Effective Date: {LEGAL_EFFECTIVE_DATE} · Version: {LEGAL_VERSIONS.terms}</p>
        <p className="text-xs text-muted2 mb-10">Operator: GetServiHub · Contact: hello@getservihub.com · Support: support@getservihub.com · General location: San Diego County, California</p>

        <div className="space-y-6 text-sm text-muted2 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Acceptance of These Terms</h2>
            <p>These Terms of Service (the &quot;Terms&quot;) govern access to and use of GetServiHub, GetServiHub Pro, and related websites, features, directories, profiles, listings, galleries, messaging, reviews, trust and verification features, project-discovery features, and other services we make available (collectively, the &quot;Platform&quot;). By creating an account, submitting an application, clicking an acceptance control, or otherwise using the Platform after being presented with these Terms, you agree to be bound by them and acknowledge the Privacy Policy and applicable Community, Reviews &amp; Content Policy.</p>
            <p className="mt-2">If you do not agree, do not create an account or use the Platform. If you use the Platform on behalf of a business or organization, you represent that you have authority to bind that entity, and &quot;you&quot; includes that entity.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. Eligibility and Accounts</h2>
            <p>You must be at least 18 years old and legally capable of entering into a binding contract to use the Platform. You must provide accurate account information, keep credentials secure, and promptly update material information. You are responsible for activity conducted through your account except to the extent caused by GetServiHub&apos;s own breach of applicable law.</p>
            <p className="mt-2">We may require additional information to operate trust, safety, verification, fraud-prevention, or professional eligibility features. Providing false, misleading, stolen, or impersonated information is prohibited.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. What GetServiHub Is - and Is Not</h2>
            <p>GetServiHub is a technology marketplace and discovery platform designed to help users find, evaluate, communicate with, and potentially engage independent service providers and professionals. GetServiHub may also provide tools for profiles, portfolios, reviews, messaging, project discovery, trust signals, visibility, and related business features.</p>
            <p className="mt-2">Unless expressly stated otherwise for a specific feature, GetServiHub is not the provider of services advertised by third parties; is not the employer, agent, partner, joint venturer, franchisee, contractor, subcontractor, representative, insurer, guarantor, or supervisor of any provider or professional; and does not control the manner, means, schedule, staffing, tools, pricing, safety procedures, licensing compliance, or performance of third-party work.</p>
            <p className="mt-2">A user&apos;s decision to contact, hire, contract with, pay, admit onto property, entrust property or a vehicle to, or otherwise engage another user is a transaction between those users. GetServiHub is not a party to that service contract unless a future feature expressly states otherwise in separate terms.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. Clients and Customers</h2>
            <p>Clients are responsible for describing their needs accurately, evaluating providers, asking appropriate questions, confirming scope, price, timing, credentials, insurance, permits, licenses, warranties, and other requirements relevant to the contemplated work, and using reasonable judgment before allowing access to people, property, vehicles, accounts, documents, or confidential information.</p>
            <p className="mt-2">Clients must not use the Platform to request unlawful, dangerous, fraudulent, discriminatory, exploitative, or prohibited services.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Providers and Professionals</h2>
            <p>Providers and GetServiHub Pro professionals are independent businesses or individuals. They are solely responsible for the services they offer and perform, including quality, safety, legality, estimates, pricing, taxes, staffing, equipment, transportation, permits, insurance, bonds, professional duties, warranties, contracts, and compliance with all laws, codes, licensing rules, ethical rules, and industry standards applicable to them.</p>
            <p className="mt-2">Providers must accurately describe qualifications, licenses, credentials, experience, availability, service areas, pricing information, images, portfolio work, and other claims. They may not imply that GetServiHub employs, licenses, certifies, insures, endorses, guarantees, or supervises them unless GetServiHub expressly states that specific fact.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Regulated, Licensed, and Higher-Risk Services</h2>
            <p>The Platform may contain listings involving automobiles, towing, construction, remodeling, roofing, electrical work, plumbing, pools, pest control, beauty services, property access, and other services that may create risk of personal injury, property damage, regulatory violations, or financial loss. The Platform may also include lawyers, architects, engineers, consultants, designers, and other regulated or specialized professionals through GetServiHub Pro.</p>
            <p className="mt-2">Users are responsible for determining whether a provider must hold a license, permit, insurance policy, bond, certification, registration, or other authorization for the particular work and location. A profile, badge, verification status, ranking, review, or appearance on the Platform does not replace that inquiry.</p>
            <p className="mt-2">GetServiHub does not provide legal, architectural, engineering, accounting, tax, financial, medical, safety, code-compliance, permitting, or other professional advice. Information or automated project suggestions supplied by the Platform are informational and organizational only and may be incomplete, inaccurate, or inapplicable to a particular project or jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. GetServiHub Pro and Professional Relationships</h2>
            <p>Finding, viewing, contacting, or communicating with a professional through GetServiHub Pro does not by itself create an attorney-client, architect-client, engineer-client, accountant-client, fiduciary, confidential, or other professional relationship with GetServiHub or necessarily with the listed professional. Any such relationship is governed by the professional&apos;s own engagement process, conflicts checks, written agreements, licensing rules, and professional obligations.</p>
            <p className="mt-2">Users should not treat general Platform content or Project Engine output as a substitute for advice from an appropriately licensed professional who has evaluated the user&apos;s actual facts and jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Project Discovery and Matching</h2>
            <p>The Platform may allow a user to describe a project or problem and may suggest categories of services, professions, providers, professionals, or next steps. These suggestions are discovery tools, not a determination that a particular professional is required, qualified, available, suitable, conflict-free, licensed for the matter, or sufficient to complete the project.</p>
            <p className="mt-2">Users remain responsible for confirming the actual legal, regulatory, technical, financial, permitting, safety, and professional requirements of their project.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Verification, Licenses, Trust Signals, and VerTrust</h2>
            <p>GetServiHub may display verification indicators, license-related information, response signals, review information, membership history, trust components, VerTrust outputs, or other signals. The meaning and scope of each signal are limited to the checks or data sources actually used by GetServiHub for that feature at that time.</p>
            <p className="mt-2">Unless expressly stated, a verification indicator is not a certification, endorsement, background check, guarantee of identity, guarantee of licensure, guarantee of insurance, guarantee of competence, guarantee of safety, or promise of satisfactory performance. Licenses, insurance, disciplinary status, and business information can expire, change, be suspended, or be inaccurately reported. Users should independently verify information material to their decision.</p>
            <p className="mt-2">GetServiHub may change, correct, remove, or suspend trust indicators when data changes, cannot be confirmed, or appears inaccurate or manipulated.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">10. Rankings, Recommendations, Visibility, and Sponsored Placement</h2>
            <p>Search ordering, discovery, recommendations, featured placements, and visibility may use multiple signals. Paid plans or sponsored placements may affect exposure where disclosed, but must not be represented as independent quality judgments. Sponsored or paid placement will be identified where required.</p>
            <p className="mt-2">A higher position, featured appearance, plan level, badge, or recommendation does not guarantee superior quality, safety, availability, suitability, or outcome. GetServiHub may adjust ranking systems to improve relevance, trust, fairness, safety, performance, or resistance to manipulation.</p>
            <p className="mt-2">Providers may not purchase, manipulate, fabricate, or coordinate reviews, engagement, clicks, follows, or other signals to create a misleading impression of reputation or popularity.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">11. Pricing, Estimates, Payments, and Off-Platform Transactions</h2>
            <p>Prices, &quot;starting at&quot; amounts, estimates, hourly rates, ranges, and other pricing information shown on the Platform are supplied by providers or derived from provider-supplied service data unless expressly stated otherwise. &quot;Starting at&quot; describes an advertised starting price for a service and does not state what a photographed job cost or guarantee the final price.</p>
            <p className="mt-2">Users are responsible for confirming scope, price, taxes, deposits, cancellation terms, change orders, payment method, warranties, and other commercial terms directly with the provider. GetServiHub currently does not represent that it processes or holds payment for third-party services unless a payment feature is expressly introduced with separate disclosures and terms.</p>
            <p className="mt-2">GetServiHub is not responsible for cash, card, bank, peer-to-peer, or other payment arrangements made directly between users.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">12. Communications and Messaging</h2>
            <p>The Platform may facilitate messages and contact options. Users are responsible for their communications and for avoiding disclosure of unnecessary sensitive information. GetServiHub does not guarantee that messages will be delivered, read, retained indefinitely, or remain available after account or feature changes.</p>
            <p className="mt-2">Users may not use communications for spam, harassment, threats, fraud, phishing, unlawful solicitation, discriminatory conduct, credential theft, malware, or other prohibited activity. We may investigate reported abuse and take action consistent with law and our policies.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">13. Reviews, Ratings, Comments, Gallery, and User Content</h2>
            <p>Users may be able to submit reviews, ratings, comments, photographs, posts, portfolio material, descriptions, and other content (&quot;User Content&quot;). User Content must reflect genuine experience where presented as a review or testimonial and must comply with the Community, Reviews &amp; Content Policy.</p>
            <p className="mt-2">You retain ownership of User Content you own, but grant GetServiHub a worldwide, non-exclusive, royalty-free, sublicensable and transferable license to host, store, reproduce, format, display, distribute, moderate, and use that content as reasonably necessary to operate, secure, improve, and promote the Platform, subject to applicable law and the Privacy Policy.</p>
            <p className="mt-2">You represent that you have the rights needed to upload the content and that doing so does not violate privacy, publicity, copyright, trademark, confidentiality, contractual, or other rights.</p>
            <p className="mt-2">GetServiHub may remove or restrict content for policy, safety, legal, fraud, intellectual-property, authenticity, or platform-integrity reasons, but does not undertake a general obligation to monitor every submission.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">14. Honest Reviews and Review Integrity</h2>
            <p>Reviews must not be fake, purchased, fabricated, generated to impersonate a real customer, posted for a service not actually experienced, or conditioned on expressing a particular positive or negative sentiment. Material relationships that could affect how a reasonable person evaluates a review should be disclosed where required.</p>
            <p className="mt-2">GetServiHub does not prohibit honest negative reviews merely because they are negative. Users and providers may report content they reasonably believe violates policy or law. Abuse of reporting tools, intimidation, or baseless threats intended to suppress legitimate criticism is prohibited.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">15. Intellectual Property</h2>
            <p>The Platform, including GetServiHub names, logos, interface, software, design, text created by GetServiHub, databases, and other proprietary materials, is owned by or licensed to GetServiHub and is protected by applicable intellectual-property laws. These Terms do not transfer ownership to users.</p>
            <p className="mt-2">Users may not copy, scrape, reverse engineer, frame, republish, sell, exploit, or use Platform materials or data except as permitted by law or written authorization. Automated access that burdens the Platform, circumvents controls, or harvests personal information is prohibited.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">16. Copyright and Rights Complaints</h2>
            <p>If you believe content on the Platform infringes your copyright or other rights, contact hello@getservihub.com with sufficient information to identify the work, the allegedly infringing material, your contact information, and the basis for your claim. GetServiHub may request additional information and may remove or restrict content where appropriate.</p>
            <p className="mt-2">This section is not intended to claim that GetServiHub has designated a DMCA agent. If the operator later elects to use the statutory DMCA safe-harbor process, the required designation and notice procedure should be separately implemented and published.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">17. Prohibited Conduct</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Impersonating another person or business, falsifying credentials, licenses, identity, insurance, experience, reviews, portfolio work, or service history.</li>
              <li>Fraud, theft, scams, phishing, deceptive pricing, unlawful discrimination, harassment, threats, stalking, exploitation, or violence.</li>
              <li>Uploading malware, attempting unauthorized access, probing security without authorization, circumventing access controls, or interfering with Platform operation.</li>
              <li>Manipulating rankings, reviews, trust signals, engagement, analytics, leads, or account eligibility.</li>
              <li>Posting illegal content, infringing content, non-consensual private information, or content you lack authority to publish.</li>
              <li>Using the Platform to arrange unlawful services or conduct that creates an unreasonable risk to users or the public.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">18. Safety and Emergencies</h2>
            <p>GetServiHub is not an emergency service, public-safety service, dispatch center, insurer, or emergency response provider. Do not rely on the Platform for emergencies or situations requiring immediate police, fire, medical, utility, roadside, or other emergency response.</p>
            <p className="mt-2">Users are responsible for appropriate safety precautions when meeting strangers, allowing access to homes or businesses, handing over keys or vehicles, sharing documents, or performing work at another person&apos;s property.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">19. Third-Party Services and Links</h2>
            <p>The Platform relies on third-party infrastructure and may link to or integrate third-party services. Those services may have separate terms and privacy practices. GetServiHub is not responsible for third-party websites, telecommunications networks, payment arrangements, messaging applications, or services outside its control.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">20. Availability, Changes, and Beta Features</h2>
            <p>The Platform may change, experience interruptions, contain errors, or offer beta, experimental, AI-assisted, or pre-release features. We do not guarantee uninterrupted availability, permanent storage, specific leads, revenue, ranking, response rates, business growth, or any particular commercial result.</p>
            <p className="mt-2">We may add, modify, suspend, or discontinue features, subject to applicable law and any commitments expressly made for paid services.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">21. Suspension and Termination</h2>
            <p>We may restrict, suspend, or terminate access, remove listings or content, or disable features when reasonably necessary for security, suspected fraud, policy violations, legal compliance, nonpayment of future paid features, risk to users, or protection of Platform integrity. Where appropriate and legally required, we may provide notice or an opportunity to appeal.</p>
            <p className="mt-2">Users remain responsible for obligations and transactions incurred before termination. Provisions that by their nature should survive termination - including ownership, disclaimers, limitations, indemnification, dispute provisions, and accrued obligations - survive.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">22. Disclaimer of Warranties</h2>
            <p className="uppercase">To the maximum extent permitted by law, the Platform is provided &quot;as is&quot; and &quot;as available.&quot; GetServiHub disclaims warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, and any warranty arising from course of dealing or usage of trade.</p>
            <p className="uppercase mt-2">GetServiHub does not warrant or guarantee any user, provider, professional, service, project outcome, license status, insurance status, review, rating, trust signal, verification, price, estimate, lead, message, recommendation, or result.</p>
            <p className="mt-2">Nothing in these Terms excludes warranties or rights that cannot lawfully be excluded.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">23. Limitation of Liability</h2>
            <p className="uppercase">To the maximum extent permitted by law, GetServiHub and its affiliates, owners, officers, directors, employees, contractors, and agents will not be liable for indirect, incidental, special, exemplary, punitive, or consequential damages, lost profits, lost business, loss of data, loss of goodwill, or cost of substitute services arising out of or relating to the Platform or transactions between users.</p>
            <p className="uppercase mt-2">To the maximum extent permitted by law, GetServiHub is not liable for personal injury, death, property damage, vehicle damage, construction defects, professional malpractice, theft, fraud, payment disputes, code or permit violations, or other acts or omissions of independent users or third-party providers.</p>
            <p className="uppercase mt-2">Subject to non-waivable law, GetServiHub&apos;s aggregate liability arising out of or relating to the Platform will not exceed the greater of (a) the amount you paid directly to GetServiHub for use of the Platform during the 12 months before the event giving rise to the claim or (b) USD $100.</p>
            <p className="mt-2">Some jurisdictions do not allow certain exclusions or limitations, so some of the above may not apply to you.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">24. Indemnification</h2>
            <p>To the extent permitted by law, you agree to defend, indemnify, and hold harmless GetServiHub and its affiliates, owners, officers, directors, employees, contractors, and agents from third-party claims, damages, losses, liabilities, penalties, costs, and reasonable legal fees arising from or related to: your services or professional work; your User Content; your violation of these Terms or law; your infringement of another person&apos;s rights; your taxes, employees, subcontractors, licenses, permits, insurance, contracts, or business practices; or your dispute or transaction with another user.</p>
            <p className="mt-2">This obligation does not require indemnification for liability to the extent caused by GetServiHub&apos;s own conduct where such indemnification is prohibited by law.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">25. Disputes Between Users</h2>
            <p>GetServiHub may offer reporting, communication, moderation, or support tools but is not obligated to adjudicate private contractual disputes between users. Users remain responsible for resolving disputes concerning scope, workmanship, payment, refunds, warranties, property, professional advice, or other service matters.</p>
            <p className="mt-2">GetServiHub may take platform-level action where a dispute also raises fraud, safety, policy, legal, or trust concerns.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">26. Governing Law and Venue</h2>
            <p><span className="font-semibold text-white">Subject to review by California counsel:</span> These Terms and disputes concerning the Platform are intended to be governed by the laws of the State of California, without regard to conflict-of-law principles. Unless a valid arbitration agreement is later adopted and applies, the parties intend exclusive venue in the state and federal courts located in San Diego County, California, except where applicable consumer law requires otherwise.</p>
            <div className="mt-3 border border-amber-400/30 bg-amber-400/5 rounded-lg p-3 text-xs text-amber-300">Counsel review required: Confirm operator domicile, venue, consumer-law limitations, and whether this governing-law clause is appropriate before publication.</div>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">27. Arbitration / Class-Action Waiver</h2>
            <p className="italic">[Reserved for California counsel. No binding arbitration or class-action waiver is inserted in this draft. If adopted, the clause and the electronic assent flow should be reviewed together, including opt-out mechanics, mass-arbitration considerations, small-claims rights, notice, fees, and applicable consumer-law requirements.]</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">28. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. Each published version must display a fixed effective date and version identifier. For material changes, GetServiHub should provide notice appropriate to the nature of the change and, when legally or contractually required, obtain renewed affirmative consent before the changes bind an existing user.</p>
            <p className="mt-2">Continued use alone should not be relied upon where applicable law requires affirmative assent.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">29. Electronic Communications and Records</h2>
            <p>You consent to receive agreements, notices, disclosures, and other communications electronically where permitted by law. You are responsible for maintaining a current email address. GetServiHub may retain records of acceptance, including account identifier, document version, and acceptance timestamp, subject to the Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">30. General Terms</h2>
            <p>If a provision is unenforceable, it will be enforced to the maximum extent permitted and the remaining provisions will remain in effect. Failure to enforce a provision is not a waiver. You may not assign these Terms without consent where assignment would materially affect GetServiHub; GetServiHub may assign them in connection with a merger, financing, reorganization, sale of assets, or transfer of the Platform, subject to applicable law.</p>
            <p className="mt-2">These Terms, the Privacy Policy, the Community, Reviews &amp; Content Policy, and any feature-specific terms presented to you form the agreement governing the Platform.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">31. Contact</h2>
            <p>General/legal inquiries: hello@getservihub.com</p>
            <p>Support: support@getservihub.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}
