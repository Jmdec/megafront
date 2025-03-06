"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path if needed
import { fetchEvents } from "@/app/redux/services/eventService"; // Adjust path if needed
import { AppDispatch } from "@/app/redux/store"; // Import AppDispatch type

// Define EventData interface
interface EventData {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  media_type: "image" | "video";
}

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Dispatch and selector hooks
  const dispatch = useDispatch<AppDispatch>(); // Typing dispatch
  const { events, loading, error } = useSelector((state: RootState) => state.eventsData);

  // Fetch events on component mount
  useEffect(() => {
    dispatch(fetchEvents()); // Dispatch fetchEvents action
  }, [dispatch]);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Events</span>
      </nav>

      {/* Header Section */}
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Events</h1>
        <p className="text-lg text-gray-700 mb-6">
          Discover ABIC Realty’s latest events, from celebrations to industry exhibitions.
        </p>
      </div>

      {/* Loading State */}
      {loading && <p>Loading events...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* No Events Available */}
      {events.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No Events Available</p>
      )}

      {/* Events Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            {/* Event Image or Video */}
       {event.media_type === "image" ? (
  <Image
    src={`${API_BASE_URL}${event.image}`}  // Image path
    width={400}
    height={250}
    alt={event.title}
    className="w-full h-52 object-cover rounded-t-md"
  />
) : (
  <video className="w-full h-52 object-cover rounded-t-md" controls>
    <source src={event.image} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
)}


            {/* Event Details */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold leading-tight">{event.title}</CardTitle>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{event.description}</p>
              <p className="text-sm text-gray-600 mt-1">{format(new Date(event.date), "MMMM dd, yyyy")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedEvent.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

            {/* Modal Image or Video */}
            {selectedEvent.media_type === "image" ? (
              <Image
                src={`${API_BASE_URL}${selectedEvent.image}`}
                width={600}
                height={350}
                alt={selectedEvent.title}
                className="w-full h-80 object-cover rounded-md"
              />
            ) : (
              <video className="w-full h-80 object-cover rounded-md" controls>
                <source src={selectedEvent.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Event Description */}
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedEvent.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
