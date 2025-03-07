"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchRealEstateNews } from "@/app/redux/services/realestateNewsService";

// Define News interface
interface News {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function RealEstateNews() {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  const { news, loading, error } = useSelector((state: RootState) => state.realEstateNewsData);


  useEffect(() => {
    dispatch(fetchRealEstateNews());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-6 py-12">
 
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Real Estate News</span>
      </nav>


      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Estate News</h1>
        <p className="text-lg text-gray-700 mb-6">
          Stay updated with the latest trends, insights, and developments in the real estate market to make informed decisions and seize new opportunities.
        </p>
      </div>


      {loading && <p className="text-center text-gray-500">Loading news...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}


      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((newsItem) => (
            <Card
              key={newsItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedNews(newsItem)}
            >
         
              <Image
                src={`${API_BASE_URL}${newsItem.image}`}
                width={400}
                height={250}
                alt={newsItem.title}
                className="w-full h-52 object-cover rounded-t-md"
              />

    
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold leading-tight">{newsItem.title}</CardTitle>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{newsItem.description}</p>
                <p className="text-sm text-gray-600 mt-1">{format(new Date(newsItem.date), "MMMM dd, yyyy")}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className=" text-gray-500 ">No News Available</p>
        )}
      </div>

 
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        {selectedNews && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedNews.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedNews.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

     
            <Image
              src={`${API_BASE_URL}${selectedNews.image}`}
              width={600}
              height={350}
              alt={selectedNews.title}
              className="w-full h-80 object-cover rounded-md"
            />

        
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedNews.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
