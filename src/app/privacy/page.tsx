export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted2 mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-6 text-sm text-muted2 leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-base mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly: name, email, phone number, business information, and any photos or content you upload. We also collect basic usage data to improve the platform.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">2. How We Use Your Information</h2>
            <p>Your information is used to operate the platform, connect clients with professionals, send service-related communications, calculate trust and ranking signals, and improve our features.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">3. Information Sharing</h2>
            <p>We do not sell your personal information. Business profiles are publicly visible by design. Contact information is shared only between clients and professionals who choose to connect.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">4. Data Security</h2>
            <p>We use industry-standard security practices, including row-level access controls on our database, to protect your data. No method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">5. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting hello@getservihub.com. California residents have additional rights under the CCPA.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">6. Cookies</h2>
            <p>We use essential cookies to keep you signed in and to operate the platform. You can control cookie settings through your browser preferences.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-base mb-2">7. Contact</h2>
            <p>For privacy-related questions, contact us at hello@getservihub.com.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
