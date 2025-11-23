export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Privacy Policy</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: November 23, 2024</p>

                <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">1. Information We Collect</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                        <li>Name, email address, and contact information</li>
                        <li>Blood type and medical allergies (optional)</li>
                        <li>Emergency contact details</li>
                        <li>Request and response data</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Connect you with healthcare providers and donors</li>
                        <li>Send you notifications about urgent requests</li>
                        <li>Respond to your comments and questions</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">3. Information Sharing</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We do not sell your personal information. We may share your information:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                        <li>With other users when you create a public request</li>
                        <li>With service providers who assist in our operations</li>
                        <li>When required by law or to protect rights and safety</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">4. Data Security</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">5. Your Rights</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                        <li>Access and update your personal information</li>
                        <li>Delete your account and data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Request a copy of your data</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">6. Contact Us</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        If you have questions about this Privacy Policy, please contact us at:
                        <br />
                        Email: privacy@healthseva.com
                    </p>
                </div>
            </div>
        </div>
    );
}
