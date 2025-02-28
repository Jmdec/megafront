"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store'; // Adjust path as needed
 
interface ClosedDeal {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function ClosedDeals() {
  const [selectedDeal, setSelectedDeal] = useState<ClosedDeal | null>(null);
 const dispatch = useDispatch();
   const closedDeals = useSelector((state: RootState) => state.closedDealsData);
 
   return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; <span className="text-gray-900 font-semibold">Closed Deals</span>
      </nav>

      {/* Left & Right Layout */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Closed Deals</h1>
          <p className="text-lg text-gray-700 mb-6">
            Discover our successful real estate transactions, where we’ve helped clients secure their dream properties with expert guidance and exceptional service.
          </p>
        </div>
      </div>

      {/* Closed Deals Cards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {closedDeals.map((deal) => (
          <Card
            key={deal.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer w-11/12"
            onClick={() => setSelectedDeal(deal)}
          >
            {/* Deal Image */}
            <Image
              src={deal.image}
              width={400}
              height={250}
              alt={deal.title}
              className="w-full h-52 object-cover rounded-t-md"
            />

            {/* Deal Details */}
            <CardContent className="p-3 space-y-1">
              <CardTitle className="text-md font-semibold leading-tight">{deal.title}</CardTitle>
              <p className="text-sm text-gray-700 line-clamp-2 leading-tight">{deal.description}</p>
              <p className="text-sm text-gray-600 leading-tight">
                {format(new Date(deal.date), "MMMM dd, yyyy")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup Modal */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        {selectedDeal && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedDeal.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedDeal.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

            {/* Modal Image */}
            <Image
              src={selectedDeal.image}
              width={600}
              height={350}
              alt={selectedDeal.title}
              className="w-full h-80 object-cover rounded-md"
            />

            {/* Scrollable Description */}
            <div className="mt-2 max-h-48 overflow-y-auto space-y-4 p-2">
              {selectedDeal.description
                .split(/(?<=\.)\s+/) // Splits after each period followed by a space
                .reduce((acc: string[][], sentence, index) => {
                  if (index % 2 === 0) acc.push([sentence]);
                  else acc[acc.length - 1].push(sentence);
                  return acc;
                }, [] as string[][])
                .map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed">{paragraph.join(" ")}</p>
                ))}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
