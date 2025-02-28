"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path if needed

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

  // Fetch news from Redux state
  const newsArticles = useSelector((state: RootState) => state.realEstateNewsData);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Real Estate News</span>
      </nav>

      {/* Header Section */}
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Estate News</h1>
        <p className="text-lg text-gray-700 mb-6">
          Stay updated with the latest trends, insights, and developments in the real estate market to make informed decisions and seize new opportunities.
        </p>
      </div>

      {/* News Articles Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsArticles.map((news) => (
          <Card
            key={news.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedNews(news)}
          >
            {/* News Image */}
            <Image
              src={news.image}
              width={400}
              height={250}
              alt={news.title}
              className="w-full h-52 object-cover rounded-t-md"
            />

            {/* News Details */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold leading-tight">{news.title}</CardTitle>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{news.description}</p>
              <p className="text-sm text-gray-600 mt-1">{format(new Date(news.date), "MMMM dd, yyyy")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup Modal */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        {selectedNews && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedNews.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedNews.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

            {/* Modal Image */}
            <Image
              src={selectedNews.image}
              width={600}
              height={350}
              alt={selectedNews.title}
              className="w-full h-80 object-cover rounded-md"
            />

            {/* News Description */}
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedNews.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
