import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules'; // Import Autoplay
import 'swiper/css';
import 'swiper/css/effect-fade';
import { montserrat, cardo, muktaMalar } from "@/utils/fonts";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store'; // Adjust path as needed
 
const PropertyParent = () => {
   const dispatch = useDispatch();
  const properties = useSelector((state: RootState) => state.propertyData.properties);
  const property = properties.filter(prop => prop.division != "Under Construction"   );
console.log(properties)
  return (
    <>
<div className="relative w-full h-screen overflow-hidden">
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
    {property.map((residence, index) => (
      <SwiperSlide key={index} className="relative w-full h-screen">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${residence.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex items-center">
            <div
              className="h-full w-full sm:w-1/4 flex flex-col justify-center p-6 sm:p-8 text-white bg-black/60 sm:bg-opacity-60"
            >
              <h1 className="text-lg sm:text-5xl font-bold mb-2 sm:mb-4 text-center sm:text-left">
                Properties
              </h1>
              <p className="text-xs sm:text-lg leading-relaxed text-center sm:text-left p-2">
                {residence.description}
              </p>
              <div className="flex justify-center sm:justify-start">
                <button className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 border-2 border-white font-semibold rounded-lg shadow-md transition-all hover:bg-white hover:text-black">
                  VIEW {residence.name.toUpperCase()}
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 sm:bottom-20 right-6 sm:right-16 bg-black/60 px-4 sm:px-10 py-3 sm:py-6 rounded-lg shadow-lg text-white border border-white/20">
            <h2 className="text-lg sm:text-6xl font-extrabold tracking-wide uppercase text-center sm:text-left">
              {residence.name}
            </h2>
            <h3 className="text-xs sm:text-4xl font-semibold mt-1 sm:mt-2 italic text-gray-300 text-center sm:text-left">
              at {residence.location}
            </h3>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

  <div className="max-w-full mx-auto py-10 px-4 sm:px-0">
    <h1 className={`text-sm sm:text-md text-black text-center ${montserrat.className}`}>
      BUILDING COMMUNITIES
    </h1>
    <h1 className={`text-xl sm:text-3xl text-blue-800 text-center mb-4 sm:mb-6 ${muktaMalar.className}`}>
      We are committed to giving you a home within a home
    </h1>
    <p className={`text-sm sm:text-xl text-center mb-6 sm:mb-10 mx-auto text-gray-500 w-full sm:w-2/3 ${montserrat.className}`}>
 By design, our properties are not just mere habitats. Our blueprints show your enjoyment in mind and your utmost ease at the very heart of every development.
    </p>

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
      {properties.map((project, index) => (
        <SwiperSlide key={index}>
          <Card className="relative overflow-hidden rounded-lg shadow-lg w-full">
            <Image
              src={project.image}
              alt={project.name}
              width={900}
              height={500}
              className="w-full h-48 sm:h-72 object-cover"
            />
            <div className="absolute bottom-0 w-full bg-black/70 p-2 flex flex-col items-center text-center">
              <CardTitle className="text-white text-sm sm:text-lg font-bold">{project.name}</CardTitle>
              <CardContent className="text-gray-300 text-xs sm:text-sm h-2">{project.location}</CardContent>
            </div>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
       <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/user/residence/all">
            <Button className={`px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-lg !bg-white !text-[#B8986E] !border-[#B8986E] border-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${montserrat.className}`}>
              View More
            </Button>
          </Link>
        </div>
  </div>
</>
  );
};

export default PropertyParent;
