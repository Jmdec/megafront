import { montserrat, cardo } from "@/utils/fonts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ImageWithLoader from "@/components/loading/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path as needed
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules'; // Import Autoplay
import 'swiper/css';
import 'swiper/css/effect-fade';
const FeaturedProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.propertyData.properties);

  return (
    <div className="mx-auto px-6 py-16 bg-[#F9FAF1] w-full">
      <h2 className={`text-sm sm:text-md text-center text-black mb-2 tracking-widest uppercase ${montserrat.className}`}>
        MEGAWORLD TOWNSHIP
      </h2>
      <h3 className={`text-4xl sm:text-6xl text-center text-gray-700 font-bold mb-8 sm:mb-12 ${cardo.className}`}>
        FEATURED PROJECTS
      </h3>

    
<div className="relative">
  <Swiper
    spaceBetween={20}
    slidesPerView={1}
    loop={true}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    navigation={true}
    modules={[Autoplay, EffectFade, Navigation]}
    breakpoints={{
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
      1280: { slidesPerView: 4 },
    }}
    className="w-full"
  >
    {projects.map((project, index) => (
      <SwiperSlide key={index}>
        <Card className="p-2 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300 max-w-[90%] sm:max-w-[350px] mx-auto h-[500px]">
          <CardHeader>
            <div className="relative overflow-hidden rounded-lg group w-full h-64 sm:h-72 mx-auto">
              <ImageWithLoader
                src={project.image}
                alt={project.name}
                width={350}
                height={250}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-white opacity-10 transform scale-125 rotate-45 -translate-x-[130%] transition-transform duration-500 ease-in-out group-hover:translate-x-[130%]"></div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className={`text-lg sm:text-xl font-bold text-black ${cardo.className}`}>
              {project.name.toLocaleUpperCase()}
            </CardTitle>
            <p className={`text-gray-700 text-xs sm:text-sm font-medium ${montserrat.className}`}>
              {project.location.toLocaleUpperCase()}
            </p>
            <p className={`text-gray-600 text-xs sm:text-sm ${montserrat.className}`}>
              {project.details.toLocaleUpperCase()}
            </p>
         <p className={`text-xs sm:text-sm font-semibold text-[#B8986E] mt-2 ${montserrat.className}`}>
  {project.price
    .split(" - ") // Split price range
    .map(price => `₱${parseInt(price).toLocaleString()}`) // Convert to number & format with commas
    .join(" - ")} {/* Join back into a range */}
</p>

          </CardContent>
        </Card>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

      {/* View More Button */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <Link href="/user/properties">
          <Button
            className={`px-6 sm:px-6 py-3 sm:py-5 text-lg sm:text-xl !bg-white !text-[#B8986E] !border-[#B8986E] border-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${montserrat.className}`}
          >
            View More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProjects;