import PageLayout from './PageLayout';

export default function PrivacyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <div className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy Policy</h2>
            <p className="text-slate-500 mb-6">Last updated: January 2026</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">1. Information We Collect</h3>
            <p className="text-slate-500 mb-4">We collect information you provide directly to us, including name, email address, phone number, company name, and any other information you choose to provide when contacting MK ShopZone or using our services.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">2. How We Use Your Information</h3>
            <p className="text-slate-500 mb-4">We use the information we collect to provide, maintain, and improve our services, communicate with you, process transactions, send marketing communications (with your consent), and comply with legal obligations.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">3. Data Security</h3>
            <p className="text-slate-500 mb-4">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">4. Your Rights</h3>
            <p className="text-slate-500 mb-4">You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at privacy@mkshopzone.com.</p>

            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-3">5. Contact Us</h3>
            <p className="text-slate-500">If you have any questions about this Privacy Policy, please contact us at mkshopzone2@gmail.com or +91 7200059453.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
