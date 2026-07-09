export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-xs text-muted2 mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-6 text-sm text-muted2 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using GetServiHub, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. What GetServiHub Is</h2>
            <p>GetServiHub is a marketplace connecting clients with local service professionals in San Diego. We do not employ the professionals listed on the platform and act solely as an intermediary connecting the two parties.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. No Commission Policy</h2>
            <p>GetServiHub does not take a commission on jobs completed through the platform. Professionals may pay a flat subscription fee for increased visibility, but all payment for services rendered happens directly between the client and the professional.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately of any unauthorized use.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Content and Reviews</h2>
            <p>Reviews must reflect genuine experiences. Users may not post false, misleading, or fraudulent information. GetServiHub reserves the right to remove content that violates these standards.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Ranking and Visibility</h2>
            <p>Paid plans may increase how often a professional appears in search results and rotations. Paid plans do not guarantee ranking above professionals with a stronger track record for the same search. See our Trust & Safety page for details.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Limitation of Liability</h2>
            <p>GetServiHub is not liable for the quality, safety, or legality of services provided by professionals on the platform. Users engage with professionals at their own risk and are encouraged to verify credentials independently.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">8. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or misuse the platform.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">9. Contact</h2>
            <p>For questions about these Terms, contact us at hello@getservihub.com.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
