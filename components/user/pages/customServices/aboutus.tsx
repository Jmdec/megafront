"use client";

import React from "react";
import Image from "next/image";
import {
  FaUsers,
  FaGlobe,
  FaBullseye,
  FaHandshake,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 py-10 px-6">
      <div className="w-[60%] mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-96">
          <Image
            src="/AboutUs.jpg"
            layout="fill"
            objectFit="cover"
            alt="About ABIC Realty"
            className="w-full h-full"
          />
        </div>

        {/* About Section */}
        <div className="p-10 md:p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 ">
            About ABIC Realty & Consultancy
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Your trusted real estate partner with a commitment to excellence.
          </p>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At ABIC Realty, we go beyond transactions – we build
            <strong> lasting relationships</strong>. With over{" "}
            <strong>5 years of experience</strong> in real estate, we provide{" "}
            <strong>expert guidance</strong> in property buying, selling,
            leasing, and development.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="py-6 px-10 md:px-16 bg-gradient-to-r from-gray-100 to-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
            <FaBuilding className="text-blue-600 mr-2" /> Our Story
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            Founded in <strong>2018</strong>, ABIC Realty has grown into a
            leading real estate firm known for{" "}
            <strong>
              transparency, professionalism, and sustainable development
            </strong>
            . We serve both individual clients and corporate investors, offering
            market insights and strategic real estate solutions.
          </p>
        </div>

        {/* Vision & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-16">
          {/* Vision */}
          <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center border-l-4 border-blue-600">
            <FaGlobe className="text-blue-600 text-4xl mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Our Vision
            </h2>
            <p className="text-gray-700 text-sm">
              We foster <strong>trust and transparency</strong>, ensuring
              long-term success in real estate journeys.
            </p>
          </div>

          {/* Mission */}
          <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center text-center border-l-4 border-blue-600">
            <FaBullseye className="text-blue-600 text-4xl mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Our Mission
            </h2>
            <p className="text-gray-700 text-sm">
              Delivering <strong>superior real estate services</strong> with an{" "}
              <strong>entrepreneurial mindset</strong> and a personalized
              approach.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="py-16 px-10 md:px-16 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FaHandshake,
                title: "Integrity",
                desc: "Upholding honesty and professionalism.",
              },
              {
                icon: FaBuilding,
                title: "Excellence",
                desc: "Striving for the highest quality service.",
              },
              {
                icon: FaUsers,
                title: "Customer Focus",
                desc: "Prioritizing client satisfaction at every step.",
              },
              {
                icon: FaGlobe,
                title: "Innovation",
                desc: "Staying ahead of real estate market trends.",
              },
              {
                icon: FaBullseye,
                title: "Collaboration",
                desc: "Building strong partnerships in the industry.",
              },
              {
                icon: FaHandshake,
                title: "Respect",
                desc: "Treating every client with dignity and fairness.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md flex items-center"
              >
                <value.icon className="text-blue-600 text-xl mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 text-sm mt-2">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-10 md:p-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-center items-center">
            <FaUsers className="text-blue-600 mr-2" /> Get in Touch
          </h2>
          <p className="text-gray-700 mb-6">
            Our experienced professionals are ready to assist you with your real
            estate needs.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md inline-block text-left">
            <p className="text-gray-700 flex items-center">
              <FaEnvelope className="text-blue-600 mr-2" />{" "}
              <strong>Email:</strong> abicrealtycorporation@gmail.com
            </p>
            <p className="text-gray-700 flex items-center">
              <FaPhoneAlt className="text-blue-600 mr-2" />{" "}
              <strong>Phone:</strong> (+63) 926 553 6964
            </p>
            <p className="text-gray-700 flex items-center">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />{" "}
              <strong>Address:</strong> Unit 202, Campos Rueda, Urban Ave.,
              Makati City, Metro Manila, PH 1233
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
