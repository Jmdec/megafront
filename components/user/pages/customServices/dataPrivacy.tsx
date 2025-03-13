import React from "react";

const DataPrivacy = () => {
  return (
    <div className="bg-gray-100 py-12 px-6">
      <div className="w-full md:w-7/12 mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-300">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-700 py-8 px-6 text-center text-white shadow-md">
          <h1 className="text-4xl font-bold tracking-wide">
            DATA PRIVACY POLICY
          </h1>
          <p className="text-lg mt-2">
            Last Updated:{" "}
            <span className="font-semibold">February 13, 2025</span>
          </p>
        </div>

        {/* Content Section */}
        <div className="p-10 space-y-8">
          <p className="text-gray-700 text-lg leading-relaxed">
            ABIC Realty values your privacy and is committed to protecting your
            personal data. This policy outlines how we collect, use, and
            safeguard your information when you use our website and services.
          </p>

          {/* Sections */}
          <div className="space-y-8">
            {/* Section 1 - Information We Collect */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                1. Information We Collect
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  Personal information (e.g., name, email, phone number)
                  provided through contact forms.
                </li>
                <li>Property inquiries and communication details.</li>
                <li>
                  Technical data such as IP address, browser type, and device
                  information.
                </li>
              </ul>
            </div>

            {/* Section 2 - How We Use Your Information */}
            <div className="p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  To respond to inquiries and provide property-related services.
                </li>
                <li>To improve our website, services, and user experience.</li>
                <li>
                  To comply with legal obligations and prevent fraudulent
                  activity.
                </li>
              </ul>
            </div>

            {/* Section 3 - Data Protection Measures */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                3. Data Protection Measures
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  We implement industry-standard security measures to protect
                  your data.
                </li>
                <li>
                  Access to personal data is restricted to authorized personnel
                  only.
                </li>
                <li>
                  We do not sell or share your personal information with third
                  parties without consent, except as required by law.
                </li>
              </ul>
            </div>

            {/* Section 4 - Third-Party Services */}
            <div className="p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                4. Third-Party Services
              </h2>
              <p className="text-gray-700">
                Our website may use third-party tools for analytics or
                marketing. These services have their own privacy policies, and
                we encourage you to review them.
              </p>
            </div>

            {/* Section 5 - Your Rights */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                5. Your Rights
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  You have the right to access, update, or request deletion of
                  your personal data.
                </li>
                <li>
                  You may opt out of marketing communications at any time.
                </li>
                <li>
                  To exercise your rights, please contact us using the details
                  below.
                </li>
              </ul>
            </div>

            {/* Section 6 - Updates to this Policy */}
            <div className="p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                6. Updates to this Policy
              </h2>
              <p className="text-gray-700">
                We may update this policy from time to time. Any changes will be
                posted on this page with an updated date.
              </p>
            </div>

            {/* Section 7 - Contact Us */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                7. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions or concerns regarding this Data
                Privacy Policy, please contact us:
              </p>
              <div className="bg-white p-4 rounded-lg mt-4 shadow">
                <p className="text-gray-700">
                  <strong>Email:</strong> abicrealtycorporation@gmail.com
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> (+63) 926 553 6964
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Unit 202, Campos Rueda, Urban Ave.,
                  Makati City, Metro Manila, PH 1233
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
