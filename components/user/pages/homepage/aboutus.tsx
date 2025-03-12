import React from "react";
import { montserrat,cardo } from "@/utils/fonts";


const AboutUs = () => {
  return (
     <section className="min-h-screen flex flex-col justify-center max-w-4xl mx-auto p-6 text-center top-1/2">
      <h2 className="text-sm font-bold text-gray-800 mb-4">WHO WE ARE</h2>
      <h1 className={`text-5xl text-black mb-6 ${cardo.className}`}>
        DISCOVER MEGAWORLD'S PREMIER REAL ESTATE OFFERINGS
      </h1>
      <p className={`text-gray-700 text-justify ${montserrat.className}`}>
 Megaworld Corporation is the country’s leading real estate developer and No. 1 business process and outsourcing (BPO) office developer and landlord in the Philippines. Led by real estate magnate and visionary, Dr. Andrew L. Tan, Megaworld pioneered the LIVE-WORK-PLAY-LEARN township concept in the country. To date, the company has introduced 15 successful large-scale, master-planned mixed-use townships across the country: the 18 hectare Eastwood City in Quezon City, which is the first cyberpark in the Philippines; 25-hectare Newport City in Pasay City, home of Resorts World Manila; 34.5-hectare McKinley West, 50-hectare McKinley Hill, 15.4-hectare Uptown Bonifacio, and 5-hectare Forbes Town Center in Fort Bonifacio; 28.8-hectare The Mactan Newtown in Lapu-Lapu City, Cebu; 72-hectare Iloilo Business Park in Mandurriao, Iloilo; 12.3-hectare Woodside City in Pasig; and 11-hectare Davao Park District in Davao; as well as the 350-hectare Suntrust Ecotown, under its wholly-owned subsidiary Suntrust Properties, Inc. and GERI’s 62-hectare Alabang West; 561-hectare Southwoods City in the boundaries of Cavite and Laguna; 150-hectare Boracay Newcoast in Boracay Island; and the 1,300-hectare Twin Lakes in Tagaytay.
      </p>
      <button
  className={`p-4 text-sm font-semibold text-[#C8AB82] border border-[#C8AB82] rounded-lg  w-1/3 mx-auto
    mt-10 
              hover:bg-[#C8AB82] hover:text-white transition-all duration-300 ease-in-out 
              shadow-md hover:shadow-lg transform hover:scale-105 ${montserrat.className}`}
>
  READ MORE ABOUT US
</button>

    </section>
  );
};

export default AboutUs;