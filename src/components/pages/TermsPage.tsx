import PageLayout from './PageLayout';

export default function TermsPage() {
  return (
    <PageLayout title="Terms of Service">
      <div className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms of Service</h2>
            <p className="text-slate-500 mb-6">Last updated: January 2026</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">1. Acceptance of Terms</h3>
            <p className="text-slate-500 mb-4">By accessing or using MK ShopZone's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">2. Services Description</h3>
            <p className="text-slate-500 mb-4">MK ShopZone provides digital marketing services including SEO, PPC, social media marketing, web development, content marketing, and brand strategy. Specific deliverables and timelines will be outlined in individual service agreements.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">3. Payment Terms</h3>
            <p className="text-slate-500 mb-4">Payment is due monthly in advance unless otherwise specified. We accept bank transfer, credit card, and PayPal. Late payments may result in service suspension.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">4. Cancellation & Refund</h3>
            <p className="text-slate-500 mb-4">Either party may terminate services with 30 days written notice. We offer a 30-day money-back guarantee for new clients. Refunds are processed within 14 business days.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">5. Limitation of Liability</h3>
            <p className="text-slate-500">MK ShopZone's liability is limited to the amount paid for services in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
