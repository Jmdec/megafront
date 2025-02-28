"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store"; // Adjust path if needed

// Define Meeting interface
interface Meeting {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function Meetings() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Fetch meetings from Redux state
  const meetings = useSelector((state: RootState) => state.meetingsData);
console.log(meetings)
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Meetings</span>
      </nav>

      {/* Header Section */}
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Team Meetings</h1>
        <p className="text-lg text-gray-700 mb-6">
          Stay updated with the latest discussions, strategies, and insights from our sales meetings.
        </p>
      </div>

      {/* Meetings Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <Card
            key={meeting.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedMeeting(meeting)}
          >
            {/* Meeting Image */}
            <Image
              src={meeting.image}
              width={400}
              height={250}
              alt={meeting.title}
              className="w-full h-52 object-cover rounded-t-md"
            />

            {/* Meeting Details */}
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold leading-tight">{meeting.title}</CardTitle>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{meeting.description}</p>
              <p className="text-sm text-gray-600 mt-1">{format(new Date(meeting.date), "MMMM dd, yyyy")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popup Modal */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        {selectedMeeting && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedMeeting.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedMeeting.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

            {/* Modal Image */}
            <Image
              src={selectedMeeting.image}
              width={600}
              height={350}
              alt={selectedMeeting.title}
              className="w-full h-80 object-cover rounded-md"
            />

            {/* Meeting Description */}
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedMeeting.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
