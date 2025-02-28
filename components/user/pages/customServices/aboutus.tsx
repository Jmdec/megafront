"use client";

import React from "react";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="min-h-screen w-[60%] mx-auto border-x-2 flex items-center justify-center">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-12">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
          ABOUT US
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Discover who we are and what we stand for.
        </p>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Image */}
          <div className="flex justify-center">
            <Image
              src="/about-us.jpg" // Replace with an actual image path
              width={400}
              height={300}
              alt="About Us"
              className="rounded-lg shadow-md transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Right Column - Text Content */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              ABIC Realty is a premier real estate company dedicated to providing top-quality property solutions.
              With a strong foundation in trust and transparency, we help individuals and businesses find 
              their perfect real estate match.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower clients with the knowledge and resources they need to make informed 
              real estate decisions. We aim to redefine industry standards through innovation, integrity, and excellence.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-center">
            <li>Expert knowledge of the real estate market.</li>
            <li>Personalized service to meet unique client needs.</li>
            <li>Commitment to transparency, honesty, and professionalism.</li>
            <li>Proven track record of successful property transactions.</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-4">
            Whether you are looking to buy, sell, or invest in property, we are here to guide you. Contact us today!
          </p>
          <div className="bg-gray-50 p-4 rounded-lg inline-block text-left">
            <p className="text-gray-700"><strong>Email:</strong> abicrealtycorporation@gmail.com</p>
            <p className="text-gray-700"><strong>Phone:</strong> (+63) 926 553 6964</p>
            <p className="text-gray-700"><strong>Address:</strong> Unit 202, Campos Rueda, Urban Ave., Makati City, Metro Manila, PH 1233</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
