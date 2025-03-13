import Image from "next/image";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaFacebook, FaInstagram } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function AgentProfile() {
  const [activeTab, setActiveTab] = useState("testimonials");

  const data = {
    agent: {
      name: "Ella Carmela Sarmiento",
      role: "Property Specialist",
      image: "/agent/Ella Carmela Sarmiento/ella.jpg",
      description:
        "As a dedicated property seller with extensive experience in the real estate market, I take pride in being recognized as one of DMCI Homes’ Top 5 Property Consultants in the JB Division. My commitment to providing exceptional service and delivering results has been the cornerstone of my success.",
      contacts: {
        email: "elladmcihomes888@gmail.com",
        phone: "(+63) 0917 548 0999",
      },
      sociallinks: {
        facebook:
          "https://www.facebook.com/people/Sonora-Garden-Residences-DMCI-Homes-by-Ella-Sarmiento/61552248994353",
        instagram:
          "https://www.instagram.com/ella.dmcihomes/?igsh=MXdkOGhlcXJ6ZXJoaw%3D%3D&utm_source=qr#",
      },
    },
    testimonials: [
      {
        text: "Ella was amazing! She helped us find our dream home quickly and efficiently.",
        author: "- Jane Smith",
      },
      {
        text: "Ella was amazing! She helped us find our dream home quickly and efficiently.",
        author: "- Jane Smith",
      },
      {
        text: "Highly recommended! Professional and efficient service.",
        author: "- Mark Rivera",
      },
      {
        text: "She made the buying process smooth and stress-free!",
        author: "- Anne Lopez",
      },
    ],
    certificates: [
      "/agent/Ella Carmela Sarmiento/credentials1.jpg",
      "/agent/Ella Carmela Sarmiento/credentials2.jpg",
      "/agent/Ella Carmela Sarmiento/credentials3.jpg",
      "/agent/Ella Carmela Sarmiento/credentials4.jpg",
    ],
    gallery: [
      "/agent/Ella Carmela Sarmiento/photo_2024-10-05_18-30-19.jpg",
      "/agent/Ella Carmela Sarmiento/photo_2024-10-05_18-30-22.jpg",
      "/agent/Ella Carmela Sarmiento/photo_2024-10-05_18-30-23.jpg",
      "/agent/Ella Carmela Sarmiento/photo_2024-10-05_18-30-24.jpg",
    ],
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-24 relative">
      {/* Social Links - Positioned in the Upper Right */}
      <div className="absolute top-6 right-6 flex space-x-4">
        <a
          href={data.agent.sociallinks.facebook}
          target="_blank"
          className="text-blue-500 hover:text-blue-700"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href={data.agent.sociallinks.instagram}
          target="_blank"
          className="text-pink-500 hover:text-pink-700"
        >
          <FaInstagram size={24} />
        </a>
      </div>

      {/* Agent Info */}
      <div className="flex items-center space-x-6">
        <Image
          src={data.agent.image}
          width={120}
          height={120}
          className="rounded-full border-4 border-blue-500"
          alt="Agent Profile"
        />
        <div>
          <h1 className="text-2xl font-bold">{data.agent.name}</h1>
          <p className="text-gray-600">{data.agent.role}</p>
          <div className="mt-2 text-gray-600 space-y-1">
            <a
              href={`tel:${data.agent.contacts.phone}`}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FaPhone /> {data.agent.contacts.phone}
            </a>
            <a
              href={`mailto:${data.agent.contacts.email}`}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <FaEnvelope /> {data.agent.contacts.email}
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-700">{data.agent.description}</p>

      {/* Tabs */}
      <div className="mt-6 flex space-x-4">
        {["testimonials", "certificates", "gallery"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-lg font-medium transition ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        {activeTab === "testimonials" && (
          <div>
            <h3 className="text-lg font-semibold">Testimonials</h3>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={3}
              loop={true} // Enables infinite loop
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }} // Autoplay Enabled
              className="mt-4 h-40"
            >
              {data.testimonials.map((testimonial, index) => (
                <SwiperSlide
                  key={index}
                  className="p-4 bg-white shadow-md rounded-lg h-40 flex flex-col justify-between"
                >
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  <p className="text-right font-semibold text-gray-800 mt-auto">
                    {testimonial.author}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {activeTab === "certificates" && (
          <div>
            <h3 className="text-lg font-semibold">Certificates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {data.certificates.map((certificate, index) => (
                <Image
                  key={index}
                  src={certificate}
                  width={150}
                  height={150}
                  className="rounded shadow-md hover:scale-105 transition h-52"
                  alt={`Certificate ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div>
            <h3 className="text-lg font-semibold">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {data.gallery.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={150}
                  height={150}
                  className="rounded shadow-md hover:scale-105 transition h-52"
                  alt={`Gallery Image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
