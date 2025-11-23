export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Terms of Service</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: November 23, 2024</p>

                <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        By accessing and using Health Seva, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">2. Use of Service</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        You agree to use Health Seva only for lawful purposes and in accordance with these Terms. You agree not to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                        <li>Post false or misleading information</li>
                        <li>Impersonate any person or entity</li>
                        <li>Harass, abuse, or harm another person</li>
                        <li>Violate any applicable laws or regulations</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">3. User Accounts</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">4. Medical Disclaimer</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Health Seva is a platform for connecting people with healthcare resources. We do not provide medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">5. Limitation of Liability</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Health Seva shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">6. Changes to Terms</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the platform.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">7. Contact Information</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        For questions about these Terms, please contact us at:
                        <br />
                        Email: legal@healthseva.com
                    </p>
                </div>
            </div>
        </div>
    );
}
