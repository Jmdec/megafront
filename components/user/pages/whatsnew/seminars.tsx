"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path if needed

// Define Seminar interface
interface Seminar {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function Seminars() {
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);

  // Fetch seminars from Redux state
  const seminars = useSelector((state: RootState) => state.seminarsData);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Seminars</span>
      </nav>

      {/* Header Section */}
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Seminars</h1>
        <p className="text-lg text-gray-700 mb-6">
          Explore our engaging seminars designed to inspire, educate, and empower individuals in real estate and beyond.
        </p>
      </div>

      {/* Seminar Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {seminars.map((seminar) => (
          <Card
            key={seminar.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedSeminar(seminar)}
          >
            {/* Seminar Image */}
            <Image
              src={seminar.image}
              width={400}
              height={250}
              alt={seminar.title}
              className="w-full h-52 object-cover rounded-t-md"
            />

            {/* Seminar Details */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold leading-tight">{seminar.title}</CardTitle>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{seminar.description}</p>
              <p className="text-sm text-gray-600 mt-1">{format(new Date(seminar.date), "MMMM dd, yyyy")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup Modal */}
      <Dialog open={!!selectedSeminar} onOpenChange={() => setSelectedSeminar(null)}>
        {selectedSeminar && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedSeminar.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedSeminar.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

            {/* Modal Image */}
            <Image
              src={selectedSeminar.image}
              width={600}
              height={350}
              alt={selectedSeminar.title}
              className="w-full h-80 object-cover rounded-md"
            />

            {/* Seminar Description */}
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedSeminar.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
