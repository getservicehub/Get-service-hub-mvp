export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg text-white pt-[100px] pb-16 px-5">
      <div className="max-w-[600px] mx-auto">
        <div className="text-xs font-bold tracking-[2px] uppercase text-cyan-400 mb-3">Contact Us</div>
        <h1 className="text-3xl font-extrabold mb-6">We're here to help</h1>

        <p className="text-sm text-muted2 leading-relaxed mb-8">
          Have a question, a problem with a booking, or feedback about the platform? Reach out and we will get back to you as soon as possible.
        </p>

        <div className="bg-card border border-white/[.08] rounded-2xl p-6 space-y-4">
          <div>
            <div className="text-xs font-semibold text-muted2 mb-1">General inquiries</div>
            <a href="mailto:hello@getservihub.com" className="text-cyan-400 font-semibold text-sm">hello@getservihub.com</a>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted2 mb-1">Report a problem</div>
            <a href="mailto:support@getservihub.com" className="text-cyan-400 font-semibold text-sm">support@getservihub.com</a>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted2 mb-1">Service Area</div>
            <div className="text-sm text-white">San Diego County, California</div>
          </div>
        </div>
      </div>
    </main>
  );
}
