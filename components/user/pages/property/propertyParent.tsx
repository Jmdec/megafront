"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { montserrat, cardo, muktaMalar } from "@/utils/fonts";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchProperties } from "@/app/redux/services/propertyService";

const PropertyParent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ✅ Fetch properties from Redux store
  const properties = useSelector(
    (state: RootState) => state.propertyData.properties
  );
  const loading = useSelector((state: RootState) => state.propertyData.loading);
  const error = useSelector((state: RootState) => state.propertyData.error);

  // ✅ Fetch properties on mount
  useEffect(() => {
    dispatch(fetchProperties()); // Fetch properties on mount
  }, [dispatch]);

  useEffect(() => {
    console.log("✅ Fetched Properties:", properties);
  }, [properties]); // Logs properties whenever it updates

  const filteredProperties = properties.filter(
    (prop) => prop.status !== "Under Construction"
  );

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        {/* ✅ Handle Loading & Error States */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#B8986E] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Swiper
            modules={[Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            speed={1000}
            effect="fade"
            className="w-full h-full"
          >
            {filteredProperties.map((residence, index) => (
              <SwiperSlide key={index} className="relative w-full h-screen">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${API_BASE_URL}${residence.image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 flex items-center ">
                    <div className="h-full w-full sm:w-1/3 md:w-5/12 xl:w-3/12 flex flex-col justify-center p-6 sm:p-8 text-white bg-black/60 sm:bg-opacity-60">
                      <h1 className="text-lg sm:text-5xl md:text-4xl font-bold mb-2 sm:mb-4 text-center sm:text-left">
                        Properties
                      </h1>
                      <p className="text-xs sm:text-lg md:text-md leading-relaxed text-center sm:text-left p-2">
                        {residence.description}
                      </p>
                      <div className="flex justify-center sm:justify-start">
                        <button className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 border-2 border-white font-semibold rounded-lg shadow-md transition-all hover:bg-white hover:text-black">
                          VIEW {residence.name.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 sm:bottom-20 right-6 sm:right-16 md:right-1 bg-black/60 px-4 sm:px-10 py-3 sm:py-6 rounded-lg shadow-lg text-white border border-white/20">
                    <h2 className="text-lg sm:text-6xl md:text-xl xl:text-4xl font-extrabold tracking-wide uppercase text-center sm:text-left">
                      {residence.name}
                    </h2>
                    <h3 className="text-xs sm:text-md md:text-lg xl:text-2xl font-semibold mt-1 sm:mt-2 italic text-gray-300 text-center sm:text-left">
                      at {residence.location}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="max-w-full mx-auto py-10 px-4 sm:px-0">
        <h1
          className={`text-sm sm:text-md text-black text-center ${montserrat.className}`}
        >
          BUILDING COMMUNITIES
        </h1>
        <h1
          className={`text-xl sm:text-3xl text-blue-800 text-center mb-4 sm:mb-6 ${muktaMalar.className}`}
        >
          We are committed to giving you a home within a home
        </h1>
        <p
          className={`text-sm sm:text-xl text-center mb-6 sm:mb-10 mx-auto text-gray-500 w-full sm:w-2/3 ${montserrat.className}`}
        >
          By design, our properties are not just mere habitats. Our blueprints
          show your enjoyment in mind and your utmost ease at the very heart of
          every development.
        </p>

        {/* ✅ Property Cards */}
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
          {filteredProperties.map((project, index) => (
            <SwiperSlide key={index}>
              <Link href={`/user/property/${project.id}`} passHref>
                <Card className="relative overflow-hidden rounded-lg shadow-lg w-full cursor-pointer hover:shadow-2xl transition duration-300">
                  <Image
                    src={`${API_BASE_URL}${project.image}`}
                    alt={project.name}
                    width={900}
                    height={500}
                    className="w-full h-48 sm:h-72 object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-black/70 p-2 flex flex-col items-center text-center">
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
          ))}
        </Swiper>

        {/* ✅ View More Button */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/user/residence/all">
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

export default PropertyParent;
