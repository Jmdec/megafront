"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchOngoingInfrastructure } from "@/app/redux/services/ongoingInfrastructure";

// Define Infrastructure interface
interface Infrastructure {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export default function OngoingInfrastructure() {
  const [selectedProject, setSelectedProject] = useState<Infrastructure | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { projects = [], loading, error } = useSelector((state: RootState) => state.ongoingInfrastructureData);

  useEffect(() => {
    console.log("🔄 Fetching ongoing infrastructure...");
    dispatch(fetchOngoingInfrastructure());
  }, [dispatch]);

  useEffect(() => {
    console.log("📌 Updated Projects in Component:", projects);
  }, [projects]);

  return (
    <div className="container mx-auto px-6 py-12">

      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold"> Ongoing Infrastructure</span>
      </nav>

   
      <div className="text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">On-going Infrastructure</h1>
        <p className="text-lg text-gray-700 mb-6">
          Stay informed about the latest infrastructure projects that shape the future of real estate, driving growth and creating new opportunities.
        </p>
      </div>

      {loading && <p className="text-gray-500 text-center">Loading infrastructure projects...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}

 
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
    
              <Image
                src={`${API_BASE_URL}${project.image}`} 
                width={400}
                height={250}
                alt={project.title}
                className="w-full h-52 object-cover rounded-t-md"
              />

        
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold leading-tight">{project.title}</CardTitle>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{project.description}</p>
                <p className="text-sm text-gray-600 mt-1">{format(new Date(project.date), "MMMM dd, yyyy")}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className=" text-gray-500">No Ongoing Infrastructure Projects Available</p>
        )}
      </div>


      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="max-w-3xl p-6 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
              <p className="text-gray-600 mt-2">{format(new Date(selectedProject.date), "MMMM dd, yyyy")}</p>
            </DialogHeader>

   
            <Image
              src={`${API_BASE_URL}${selectedProject.image}`}
              width={600}
              height={350}
              alt={selectedProject.title}
              className="w-full h-80 object-cover rounded-md"
            />

      
            <div className="mt-4 text-gray-700 leading-relaxed">
              {selectedProject.description}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
