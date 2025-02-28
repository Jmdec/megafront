"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path if needed

// Define Tip interface
interface Tip {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function RealEstateTips() {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  // Fetch tips from Redux state
  const tips = useSelector((state: RootState) => state.realEstateTipsData);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Real Estate Tips</span>
      </nav>

      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Estate Tips</h1>
        <p className="text-lg text-gray-700 mb-6">
          Get expert advice and valuable tips to navigate the real estate market, whether you’re buying, selling, or investing in properties.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <Card
            key={tip.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedTip(tip)}
          >
            {/* Tip Image */}
            <Image
              src={tip.image}
              width={400}
              height={250}
              alt={tip.title}
              className="w-full h-52 object-cover rounded-t-md"
            />

            {/* Tip Details */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold leading-tight">{tip.title}</CardTitle>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{tip.description}</p>
              <p className="text-sm text-gray-600 mt-1">{format(new Date(tip.date), "MMMM dd, yyyy")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup Modal */}
      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        {selectedTip && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTip.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedTip.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

            {/* Modal Image */}
            <Image
              src={selectedTip.image}
              width={600}
              height={350}
              alt={selectedTip.title}
              className="w-full h-80 object-cover rounded-md"
            />

            {/* Tip Description */}
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedTip.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
