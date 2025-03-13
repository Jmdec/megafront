"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { montserrat, muktaMalar } from "@/utils/fonts";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchOffices } from "@/app/redux/services/officeService";

const OfficeParent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Get office data from Redux store
  const properties = useSelector(
    (state: RootState) => state.officeData.offices
  );
  const loading = useSelector((state: RootState) => state.officeData.loading);
  const error = useSelector((state: RootState) => state.officeData.error);

  useEffect(() => {
    dispatch(fetchOffices());
  }, [dispatch]);

  const officeProjects = properties.filter(
    (prop) => prop.status !== "Under Construction"
  );

  return (
    <>
      {/* ✅ Loading & Error Messages */}
      {loading && (
        <p className="text-center text-gray-500">Loading offices...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* ✅ Hero Section (Swiper with Offices) */}
      <div className="relative w-full h-screen overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={500}
          effect="fade"
          className="w-full h-full"
        >
          {officeProjects.map((office) => {
            const imageUrl = office.image
              ? `${API_BASE_URL}${office.image}`
              : "/default-office.jpg";

            return (
              <SwiperSlide
                key={office.name}
                className="relative w-full h-screen"
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Dark Overlay & Text Content */}
                  <div className="absolute inset-0 flex items-center z-10 w-9/12">
                    <div className=" sm:w-1/3 flex flex-col justify-center p-6 sm:p-8 text-white bg-black/50 sm:bg-opacity-60 h-full">
                      <h1 className="text-lg sm:text-5xl font-bold mb-2 sm:mb-4 text-center sm:text-left ">
                        Offices
                      </h1>
                      <p className="text-xs sm:text-lg leading-relaxed text-center sm:text-left p-2">
                        {office.description}
                      </p>
                      <div className="flex justify-center sm:justify-start">
                        <button className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 border-2 border-white font-semibold rounded-lg shadow-md transition-all hover:bg-white hover:text-black">
                          VIEW {office.name.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Office Name & Location */}
                  <div className="absolute bottom-6 sm:bottom-20 right-6 sm:right-16 bg-black/70 px-4 sm:px-10 py-3 sm:py-6 rounded-lg shadow-lg text-white border border-white/30 z-20">
                    <h2 className="text-lg sm:text-6xl font-extrabold tracking-wide uppercase text-center sm:text-left">
                      {office.name}
                    </h2>
                    <h3 className="text-xs sm:text-4xl font-semibold mt-1 sm:mt-2 italic text-gray-300 text-center sm:text-left">
                      at {office.location}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ✅ Office Section */}
      <div className="max-w-full mx-auto py-10 px-4 sm:px-0">
        <h1
          className={`text-sm sm:text-md text-black text-center ${montserrat.className}`}
        >
          EMPOWERING WORKSPACES
        </h1>
        <h1
          className={`text-xl sm:text-3xl text-blue-800 text-center mb-4 sm:mb-6 ${muktaMalar.className}`}
        >
          Designed for Efficiency, Built for Success
        </h1>
        <p
          className={`text-sm sm:text-xl text-center mb-6 sm:mb-10 mx-auto text-gray-500 w-full sm:w-2/3 ${montserrat.className}`}
        >
          Our office spaces provide a professional and dynamic environment
          tailored to modern businesses, ensuring productivity and success in
          every square foot.
        </p>

        {/* ✅ Office Cards */}
        <Swiper
          spaceBetween={15}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          breakpoints={{
            1024: { slidesPerView: 4 },
            768: { slidesPerView: 2 },
            480: { slidesPerView: 1 },
          }}
          className="w-full"
        >
          {properties.map((project) => {
            const projectImageUrl = project.image
              ? `${API_BASE_URL}${project.image}`
              : "/default-office.jpg";

            return (
              <SwiperSlide key={project.id}>
                <Link href={`/user/office/${project.id}`} passHref>
                  <Card className="relative overflow-hidden rounded-lg shadow-lg w-full cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <Image
                      src={projectImageUrl}
                      alt={project.name}
                      width={900}
                      height={500}
                      unoptimized={true} // ✅ Ensures Next.js does not block external images
                      className="w-full h-48 sm:h-72 object-cover transition-opacity duration-300 hover:opacity-90"
                    />
                    <div className="absolute bottom-0 w-full bg-black/70 p-2 flex flex-col items-center text-center transition-all duration-300 hover:bg-black/80">
                      <CardTitle className="text-white text-sm sm:text-lg font-bold">
                        {project.name}
                      </CardTitle>
                      <CardContent className="text-gray-300 text-xs sm:text-sm">
                        {project.location}
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* ✅ View More Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/user/office/all">
            <Button
              className={`px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-lg !bg-white !text-[#B8986E] !border-[#B8986E] border-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${montserrat.className}`}
            >
              View More
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OfficeParent;
