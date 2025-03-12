"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PropertyChild from "@/components/user/pages/property/propertyChild";
import Header from "@/components/user/components/header/page";
import Footer from "@/components/user/components/footer/footer";
import { Provider } from "react-redux";
import store from "@/app/redux/store";
import Property from "@/components/user/pages/property/page";

export default function PropertySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;


  // Check if slug is a number
  const isNumber = !isNaN(Number(slug)) && slug !== "" && slug !== null;


  return (
    <Provider store={store}>
      <Header />

   <div className="mx-auto px-6 py-16 bg-[#F9FAF1] w-full">
  {isNumber ? <Property id={slug} /> : <PropertyChild property={slug} />}
</div>



      <Footer />
    </Provider>
  );
}
