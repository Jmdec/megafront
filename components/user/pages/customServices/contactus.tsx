"use client";

import { useState } from "react";
import { FaPhone, FaEnvelope,FaRegQuestionCircle, FaTwitter, FaFacebook, FaHeadset, FaFilePdf, FaMoneyBillWave, FaUser, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setFormData({ name: "", email: "", contact: "", message: "" });
  };

 return (
    <div className="container mx-auto px-6 py-12 bg-white w-[60%] border-x-2">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Contact Us</h1>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className=" shadow-lg rounded-lg p-8 space-y-6 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">📞 Get in Touch</h2>
            <div className="flex space-x-3">
              <a href="mailto:customerservice@megaworldcorp.com" target="_blank">
                <FaEnvelope className="text-blue-600 text-2xl hover:text-blue-700 transition" />
              </a>
              <a href="https://x.com/megaworld_corp" target="_blank">
                <FaTwitter className="text-blue-500 text-2xl hover:text-blue-600 transition" />
              </a>
              <a href="https://www.facebook.com/officialmegaworldcorp" target="_blank">
                <FaFacebook className="text-blue-700 text-2xl hover:text-blue-800 transition" />
              </a>
            </div>
          </div>


          <div className="space-y-3">
            <p className="text-gray-700"><strong>Megaworld Trunkline:</strong> +63 (02) 8894 6300 / +63 (02) 8894 6400</p>
            <p className="text-gray-700"><strong>Alternate:</strong> +63 (02) 7905 2800 / +63 (02) 7905 2900</p>
            <p className="text-gray-700"><strong>MEGA Hotline:</strong> +63 (02) 8888 - MEGA (6342)</p>
            <p className="text-gray-700"><strong>Hours:</strong> Monday to Saturday, 8:00 AM - 12:00 MN</p>
          </div>
        </div>

     
        <div className=" shadow-lg rounded-lg p-8">
   <h2 className="text-2xl font-semibold text-gray-900 flex items-center leading-tight mb-4">
  <FaRegQuestionCircle className="text-blue-600 mr-2" /> Got a Question?
</h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="name" placeholder="Full Name" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" required />
              <input type="email" name="email" placeholder="Email Address" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" required />
              <input type="text" name="contact" placeholder="Phone Number" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" required />
            </div>

            {/* Message Input */}
            <textarea name="message" placeholder="Write your message..." rows={3} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" required></textarea>

            {/* Submit Button */}
            <div className="text-right">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition py-2 px-6 text-white font-semibold text-md rounded-md">
                <FaPaperPlane className="inline mr-2" /> Send
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Buying a Condo Steps */}
      <div className="mt-10 text-center rounded-lg p-4 md:p-6 max-w-full mx-auto">
        <h2 className="text-xl md:text-3xl font-semibold text-gray-900 mb-3">
          Buying a Condo Can Now Be Done Entirely Online!
        </h2>
        <p className="text-gray-700 mb-4 text-sm md:text-base">
          Here are the four easy steps:
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
          {/* Step 1 */}
          <div className="text-center w-40 md:w-48">
            <div className="shadow-md rounded-md p-4">
              <FaHeadset className="text-blue-600 text-3xl md:text-4xl mx-auto mb-2" />
              <h3 className="text-md md:text-lg font-semibold">Talk to an Agent</h3>
              <p className="text-gray-700 text-xs md:text-sm mt-1">
                Message us on verified social media or megaworldcorp.com.
              </p>
            </div>
          </div>

          {/* Animated Arrow 1 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            className="text-2xl md:text-3xl text-gray-500"
          >
            ➜
          </motion.div>

          {/* Step 2 */}
          <div className="text-center w-40 md:w-48">
            <div className="shadow-md rounded-md p-4">
              <FaMoneyBillWave className="text-green-500 text-3xl md:text-4xl mx-auto mb-2" />
              <h3 className="text-md md:text-lg font-semibold">Pay Online</h3>
              <p className="text-gray-700 text-xs md:text-sm mt-1">
                Choose bank transfer, bills payment, or PesoPay.
              </p>
            </div>
          </div>

          {/* Animated Arrow 2 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            className="text-2xl md:text-3xl text-gray-500"
          >
            ➜
          </motion.div>

          {/* Step 3 */}
          <div className="text-center w-40 md:w-48">
            <div className="shadow-md rounded-md p-4">
              <FaFilePdf className="text-red-500 text-3xl md:text-4xl mx-auto mb-2" />
              <h3 className="text-md md:text-lg font-semibold">Send Documents</h3>
              <p className="text-gray-700 text-xs md:text-sm mt-1">
                Get guidance on submitting documents online.
              </p>
            </div>
          </div>

          {/* Animated Arrow 3 */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
            className="text-2xl md:text-3xl text-gray-500"
          >
            ➜
          </motion.div>

          {/* Step 4 */}
          <div className="text-center w-40 md:w-48">
            <div className="shadow-md rounded-md p-4">
              <FaCheckCircle className="text-purple-500 text-3xl md:text-4xl mx-auto mb-2" />
              <h3 className="text-md md:text-lg font-semibold">Seal the Deal</h3>
              <p className="text-gray-700 text-xs md:text-sm mt-1">
                Email proof of payment and documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
