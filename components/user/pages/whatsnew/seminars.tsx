"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store"; // Adjust path if needed
import { fetchSeminars } from "@/app/redux/services/seminarService"; // Import the async action
interface Seminar {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}
interface SeminarState {
  seminars: Seminar[]; // This should always be an array, even if empty
  loading: boolean;
  error: string | null;
}

const initialState: SeminarState = {
  seminars: [], // Default to an empty array
  loading: false,
  error: null,
};

export default function Seminars() {
  const dispatch = useDispatch<AppDispatch>(); // Redux dispatcher
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);

  // Fetch seminars from Redux store
  const { seminars, loading, error } = useSelector((state: RootState) => state.seminarsData);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch seminars on mount
 useEffect(() => {
  if (!seminars.length && !loading && !error) {
    dispatch(fetchSeminars());
  }
}, [dispatch, seminars, loading, error]);


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

      {/* Show Loading / Error */}
      {loading && <p className="text-center text-blue-500">Loading seminars...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

   

<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {seminars.length > 0 ? (
    seminars.map((seminar) => (
      <Card
        key={seminar.id}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
        onClick={() => setSelectedSeminar(seminar)}
      >
        {/* Seminar Image */}
        <Image
          src={`${API_BASE_URL}${seminar.image}`}
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
    ))
  ) : (
    <p>No seminars available.</p> // Fallback if no seminars are found
  )}
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
              src={`${API_BASE_URL}${selectedSeminar.image}`}
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
