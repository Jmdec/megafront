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
    console.log("Form Submitted:", formData);
    setFormData({ name: "", email: "", contact: "", message: "" });
  };

  return (
    <div className="bg-gray-50 py-8 px-6">
      <div className="w-[60%] mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className=" text-center rounded-lg py-10 max-w-full mx-auto ">
          <h2 className="text-lg md:text-2xl font-semibold text-gray-900 mb-2">
            Buying a Condo Online – Simple & Easy!
          </h2>
          <p className="text-gray-700 mb-3 text-xs md:text-sm">
            Just follow these four quick steps:
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
            {/* Step 1 */}
            <div className="text-center w-32 md:w-40">
              <div className="shadow rounded p-2">
                <FaHeadset className="text-blue-600 text-2xl md:text-3xl mx-auto mb-1" />
                <h3 className="text-sm font-semibold">Talk to an Agent</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Message us on verified platforms.
                </p>
              </div>
            </div>

            {/* Arrow 1 */}
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="text-lg md:text-xl text-gray-500"
            >
              ➜
            </motion.div>

            {/* Step 2 */}
            <div className="text-center w-32 md:w-40">
              <div className="shadow rounded p-2">
                <FaMoneyBillWave className="text-green-500 text-2xl md:text-3xl mx-auto mb-1" />
                <h3 className="text-sm font-semibold">Pay Online</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Choose bank, bills payment, or PesoPay.
                </p>
              </div>
            </div>

            {/* Arrow 2 */}
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.2,
              }}
              className="text-lg md:text-xl text-gray-500"
            >
              ➜
            </motion.div>

            {/* Step 3 */}
            <div className="text-center w-32 md:w-40">
              <div className="shadow rounded p-2">
                <FaFilePdf className="text-red-500 text-2xl md:text-3xl mx-auto mb-1" />
                <h3 className="text-sm font-semibold">Send Documents</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Submit documents online easily.
                </p>
              </div>
            </div>

            {/* Arrow 3 */}
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.4,
              }}
              className="text-lg md:text-xl text-gray-500"
            >
              ➜
            </motion.div>

            {/* Step 4 */}
            <div className="text-center w-32 md:w-40">
              <div className="shadow rounded p-2">
                <FaCheckCircle className="text-purple-500 text-2xl md:text-3xl mx-auto mb-1" />
                <h3 className="text-sm font-semibold">Seal the Deal</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Email proof of payment & docs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-2">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
              Get in Touch With Us
              <span className="block text-neutral-700 text-sm mt-1">
                We’re Here to Assist You
              </span>
            </h1>
            <p className="text-gray-700 w-7/12 mx-auto mt-2 text-sm md:text-xm mb-3">
              Have questions or need assistance? Our team is ready to help with
              your inquiries, partnerships, or service requests. Contact us
              today, and let’s start the conversation.
            </p>
          </div>

          <div className="container mx-auto px-4 flex justify-center">
            <div className="w-full md:w-6/12 flex bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden relative">
              {/* Form Section (Left) */}
              <div className="w-full md:w-7/12 p-4 md:p-6 bg-white absolute md:relative z-10">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 text-start mb-3">
                  Get in Touch
                </h2>

                <form className="space-y-2 w-full">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Full Name */}
                    <label className="text-gray-700 text-xs md:text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm text-xs md:text-sm"
                      required
                    />

                    {/* Email Address */}
                    <label className="text-gray-700 text-xs md:text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm text-xs md:text-sm"
                      required
                    />

                    {/* Phone Number */}
                    <label className="text-gray-700 text-xs md:text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Enter your phone number"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 shadow-sm text-xs md:text-sm"
                      required
                    />
                  </div>

                  {/* Message */}
                  <label className="text-gray-700 text-xs md:text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Write your message..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none shadow-sm text-xs md:text-sm"
                    required
                  ></textarea>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 transition py-2 px-3 md:px-4 text-white font-semibold text-xs md:text-sm rounded-md flex items-center shadow-md border border-transparent hover:border-blue-800"
                    >
                      <FaPaperPlane className="inline mr-2" /> Send Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Image Section (Right) */}
              <div className="w-8/12 hidden md:block relative">
                <img
                  src="/ContactUs.webp"
                  alt="Contact Support"
                  className="w-full h-full object-cover object-left rounded-l-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
