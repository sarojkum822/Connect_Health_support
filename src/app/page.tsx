import Link from "next/link";
import { ArrowRight, Heart, Activity, Phone } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Access medical services, find blood donors, and get help when you need it most.
              Connecting you with healthcare essentials instantly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/medic" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
                Find Medicines <ArrowRight size={20} />
              </Link>
              <Link href="/blood" className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
                Donate Blood <Heart size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Medical Assistance</h3>
              <p className="text-gray-600">
                Quick access to medical stores and essential medicines in your locality.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Blood Donation</h3>
              <p className="text-gray-600">
                Connect with blood donors or register as a donor to save lives.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock support for emergency situations and inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
