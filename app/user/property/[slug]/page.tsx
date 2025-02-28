"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PropertyChild from "@/components/user/pages/property/propertyChild";
import Header from "@/components/user/components/header/page";
import Footer from "@/components/user/components/footer/footer";
import { Provider } from "react-redux";
import store from "@/app/redux/store";
import VisitProperty from "@/components/user/pages/showroom/scheduleVisit";
import InquiryProperty from "@/components/user/pages/showroom/propertyInquiry";

export default function PropertySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [isVisitPopupOpen, setIsVisitPopupOpen] = useState(false);
  const [isInquiryPopupOpen, setIsInquiryPopupOpen] = useState(false);
  const [prevSlug, setPrevSlug] = useState<string | null>(null);

useEffect(() => {
  // Always reset popups before checking the new slug
  setIsVisitPopupOpen(false);
  setIsInquiryPopupOpen(false);

  // Open the correct popup
  if (slug === "all-schedule-a-visit") {
    setTimeout(() => setIsVisitPopupOpen(true), 0); // Ensures a re-render
  } else if (slug === "all-inquire-a-property") {
    setTimeout(() => setIsInquiryPopupOpen(true), 0);
  }
}, [slug]); // ✅ Remove prevSlug from dependencies


  // ✅ Only close popups, do not change slug to keep PropertyChild running
  const handleClose = () => {
    setIsVisitPopupOpen(false);
    setIsInquiryPopupOpen(false);
  };

  return (
    <Provider store={store}>
      <Header />

      {/* ✅ PropertyChild always runs */}
      <div className="mx-auto px-6 py-16 bg-[#F9FAF1] w-full">
        <PropertyChild property={slug} />
      </div>

      {/* ✅ Popups close properly but PropertyChild remains */}
      {isVisitPopupOpen && <VisitProperty onClose={handleClose} />}
      {isInquiryPopupOpen && <InquiryProperty onClose={handleClose} />}

      <Footer />
    </Provider>
  );
}
