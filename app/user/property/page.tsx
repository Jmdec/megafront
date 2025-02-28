"use client";
import Header from "@/components/user/components/header/page";
import Footer from "@/components/user/components/footer/footer";
import PropertyParent from "@/components/user/pages/property/propertyParent"; // Import the Township component
import { Provider } from 'react-redux'; // Import Provider
import store from "@/app/redux/store"; // Default import for store

export default function PropertyPage() {
  return (
    <>
      <Header />
      <div>
      <Provider store={store}>
         <PropertyParent /> 
      </Provider>
    
      </div>
      <Footer />
    </>
  );
}
