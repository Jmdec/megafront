"use client";

import { useState } from "react";
import {
  FaPhone,
  FaPhoneAlt,
  FaEnvelope,
  FaRegQuestionCircle,
  FaTwitter,
  FaFacebook,
  FaHeadset,
  FaFilePdf,
  FaMoneyBillWave,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFormData({ name: "", email: "", contact: "", message: "" });
  };

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6">
      <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        {/* Header Section */}
        <div className="text-center py-6 px-4 sm:px-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Buying a Condo Online – Simple & Easy!
          </h2>
          <p className="text-gray-700 text-sm sm:text-md">
            Just follow these four quick steps:
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 sm:px-6 items-center">
          {[
            {
              icon: FaHeadset,
              title: "Talk to an Agent",
              desc: "Message us on verified platforms.",
              color: "text-blue-600",
            },
            {
              icon: FaMoneyBillWave,
              title: "Pay Online",
              desc: "Choose bank, bills payment, or PesoPay.",
              color: "text-green-500",
            },
            {
              icon: FaFilePdf,
              title: "Send Documents",
              desc: "Submit documents online easily.",
              color: "text-red-500",
            },
            {
              icon: FaCheckCircle,
              title: "Seal the Deal",
              desc: "Email proof of payment & docs.",
              color: "text-purple-500",
            },
          ].map((step, index, array) => (
            <div key={index} className="flex items-center">
              {/* ✅ Step Card */}
              <div className="text-center w-28 sm:w-36 md:w-40 mx-auto">
                <div className="shadow-md rounded-md p-3 bg-white md:h-44 md:w-32">
                  <step.icon
                    className={`${step.color} text-2xl sm:text-3xl mx-auto mb-2`}
                  />
                  <h3 className="text-sm sm:text-md font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* ✅ Animated Arrow (Only between steps) */}
              {index < array.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="text-lg sm:text-xl md:text-2xl text-gray-500 mx-1 sm:mx-3"
                >
                  ➜
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="container mx-auto px-4 py-6">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Get in Touch With Us
              <span className="block text-neutral-700 text-sm mt-1">
                We’re Here to Assist You
              </span>
            </h1>
            <p className="text-gray-700 max-w-lg mx-auto text-sm sm:text-md mt-2">
              Have questions or need assistance? Contact us today, and let’s
              start the conversation.
            </p>
          </div>

          {/* Contact Form & Image Container */}
          <div className="bg-gray-50 py-8 px-4 sm:px-6">
            <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex flex-col md:flex-row">
              {/* Form Section (Left Side) */}
              <div className="w-full md:w-6/12 p-6 bg-white relative">
                <h2 className="text-md sm:text-lg font-semibold text-gray-900 mb-3">
                  Get in Touch
                </h2>
                <form className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-gray-700 text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-gray-700 text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-gray-700 text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your phone number"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-gray-700 text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      placeholder="Write your message..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none text-sm"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 transition py-2 px-4 text-white font-semibold text-sm rounded-md flex items-center shadow-md"
                    >
                      <FaPaperPlane className="mr-2" /> Send Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Image Section (Right Side - Background) */}
              <div
                className="hidden md:block w-full md:w-6/12 bg-cover bg-left rounded-l-full"
                style={{ backgroundImage: "url('/ContactUs.webp')" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
