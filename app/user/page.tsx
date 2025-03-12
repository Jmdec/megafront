"use client";
import { useState, useEffect } from "react"; // Import useRef

import Header from "@/components/user/components/header/page";
import Form from "@/components/user/pages/homepage/herosection";
import AboutUs from "@/components/user/pages/homepage/aboutus";
import Featured from "@/components/user/pages/homepage/featured";
import Footer from "@/components/user/components/footer/footer"; // ✅ Only importing Footer
import { Provider } from "react-redux"; // Import Provider
import store from "@/app/redux/store"; // Default import for store
import Loading from "@/components/loading/logo";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => setIsLoading(false), 3000);
  }, []);
  //   if (isLoading) {
  //   return <Loading />; // ✅ Show only the loading screen
  // }
  return (
    <>
      <Header />
      <div className="overflow-hidden relative min-h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover min-h-screen sm:min-h-[700px] -z-10"
          src="/logo/bgclip.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <Provider store={store}>
          <Form />
        </Provider>
      </div>
      <AboutUs />
      <Provider store={store}>
        <Featured />
      </Provider>
      <Footer />
    </>
  );
}
