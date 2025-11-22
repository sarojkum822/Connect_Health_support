import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                <p className="text-lg text-gray-600">Find answers to common questions or contact our support team.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-4">Available 24/7 for emergencies</p>
                    <p className="font-bold text-blue-600">+1 (555) 123-4567</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-4">Get response within 24 hours</p>
                    <p className="font-bold text-green-600">support@mernhealth.com</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="text-purple-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                    <p className="text-gray-600 mb-4">Chat with our support team</p>
                    <button className="text-purple-600 font-bold hover:underline">Start Chat</button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "How do I find nearby medical stores?", a: "Go to the Medic section and enter your location to see a list of nearby pharmacies." },
                        { q: "Is blood donation safe?", a: "Yes, blood donation is completely safe and conducted by certified professionals." },
                        { q: "How can I register as a donor?", a: "Navigate to the Blood section and click on 'Register as Donor' to fill out your details." },
                    ].map((faq, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <HelpCircle size={20} className="text-blue-500" />
                                {faq.q}
                            </h3>
                            <p className="text-gray-600 ml-7">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
