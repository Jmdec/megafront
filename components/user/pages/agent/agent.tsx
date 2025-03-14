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
      {/* ✅ Social Links (Upper Right Corner) */}
      <div className="absolute top-6 right-6 flex space-x-4">
        {data.agent.sociallinks.facebook && (
          <a
            href={data.agent.sociallinks.facebook}
            target="_blank"
            className="text-blue-500 hover:text-blue-700"
          >
            <FaFacebook size={24} />
          </a>
        )}
        {data.agent.sociallinks.instagram && (
          <a
            href={data.agent.sociallinks.instagram}
            target="_blank"
            className="text-pink-500 hover:text-pink-700"
          >
            <FaInstagram size={24} />
          </a>
        )}
      </div>

      {/* ✅ Agent Info */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <Image
          src={data.agent.image}
          width={120}
          height={120}
          className="rounded-full border-4 border-blue-500 object-cover"
          alt="Agent Profile"
        />
        <div>
          <h1 className="text-2xl font-bold">{data.agent.name}</h1>
          <p className="text-gray-600">{data.agent.role}</p>
          <div className="mt-2 text-gray-600 space-y-2">
            {data.agent.contacts.phone && (
              <a
                href={`tel:${data.agent.contacts.phone}`}
                className="flex items-center justify-center sm:justify-start gap-2 text-blue-600 hover:underline"
              >
                <FaPhone /> {data.agent.contacts.phone}
              </a>
            )}
            {data.agent.contacts.email && (
              <a
                href={`mailto:${data.agent.contacts.email}`}
                className="flex items-center justify-center sm:justify-start gap-2 text-blue-600 hover:underline"
              >
                <FaEnvelope /> {data.agent.contacts.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Description */}
      <p className="mt-4 text-gray-700 text-center sm:text-left">
        {data.agent.description}
      </p>

      {/* ✅ Tabs */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-start gap-3">
        {["testimonials", "certificates", "gallery"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full sm:w-auto px-4 py-2 rounded text-lg font-medium transition ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        {activeTab === "testimonials" && (
          <div>
            <h3 className="text-lg font-semibold text-center sm:text-left">
              Testimonials
            </h3>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={10}
              slidesPerView={1} // ✅ Default to 1 per row
              breakpoints={{
                640: { slidesPerView: 1 }, // ✅ 1 per row on small screens
                768: { slidesPerView: 2 }, // ✅ 2 per row on tablets
                1024: { slidesPerView: 3 }, // ✅ 3 per row on desktops
              }}
              loop={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="mt-4"
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
            <h3 className="text-lg font-semibold text-center sm:text-left">
              Certificates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {data.certificates.map((certificate, index) => (
                <Image
                  key={index}
                  src={certificate}
                  width={150}
                  height={150}
                  className="rounded shadow-md hover:scale-105 transition object-cover w-full 
                     h-48 sm:h-52 md:h-52 lg:h-52"
                  alt={`Certificate ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "gallery" && (
          <div>
            <h3 className="text-lg font-semibold text-center sm:text-left">
              Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {data.gallery.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  width={150}
                  height={150}
                  className="rounded shadow-md hover:scale-105 transition object-cover h-40 w-full"
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
