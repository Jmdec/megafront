import React from "react";

const DataPrivacy = () => {
  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6">
      <div className="w-full md:w-7/12 lg:w-8/12 mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-300">
        {/* ✅ Header Section */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-700 py-6 px-4 sm:px-6 text-center text-white shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
            DATA PRIVACY POLICY
          </h1>
          <p className="text-md sm:text-lg mt-2">
            Last Updated:{" "}
            <span className="font-semibold">February 13, 2025</span>
          </p>
        </div>

        {/* ✅ Content Section */}
        <div className="p-6 sm:p-10 space-y-8">
          <p className="text-gray-700 text-md sm:text-lg leading-relaxed text-center sm:text-left">
            ABIC Realty values your privacy and is committed to protecting your
            personal data. This policy outlines how we collect, use, and
            safeguard your information when you use our website and services.
          </p>

          {/* Sections */}
          <div className="space-y-8">
            {/* ✅ Section Wrapper */}
            {[
              {
                title: "1. Information We Collect",
                content: [
                  "Personal information (e.g., name, email, phone number) provided through contact forms.",
                  "Property inquiries and communication details.",
                  "Technical data such as IP address, browser type, and device information.",
                ],
                bg: "bg-gray-50",
              },
              {
                title: "2. How We Use Your Information",
                content: [
                  "To respond to inquiries and provide property-related services.",
                  "To improve our website, services, and user experience.",
                  "To comply with legal obligations and prevent fraudulent activity.",
                ],
                bg: "border-l-4 border-blue-500",
              },
              {
                title: "3. Data Protection Measures",
                content: [
                  "We implement industry-standard security measures to protect your data.",
                  "Access to personal data is restricted to authorized personnel only.",
                  "We do not sell or share your personal information with third parties without consent, except as required by law.",
                ],
                bg: "bg-gray-50",
              },
              {
                title: "4. Third-Party Services",
                content: [
                  "Our website may use third-party tools for analytics or marketing. These services have their own privacy policies, and we encourage you to review them.",
                ],
                bg: "border-l-4 border-blue-500",
              },
              {
                title: "5. Your Rights",
                content: [
                  "You have the right to access, update, or request deletion of your personal data.",
                  "You may opt out of marketing communications at any time.",
                  "To exercise your rights, please contact us using the details below.",
                ],
                bg: "bg-gray-50",
              },
              {
                title: "6. Updates to this Policy",
                content: [
                  "We may update this policy from time to time. Any changes will be posted on this page with an updated date.",
                ],
                bg: "border-l-4 border-blue-500",
              },
            ].map((section, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-sm ${section.bg}`}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {section.title}
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-sm sm:text-md">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ✅ Contact Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                7. Contact Us
              </h2>
              <p className="text-gray-700 text-sm sm:text-md">
                If you have any questions or concerns regarding this Data
                Privacy Policy, please contact us:
              </p>
              <div className="bg-white p-4 rounded-lg mt-4 shadow">
                <p className="text-gray-700 break-all whitespace-normal">
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
