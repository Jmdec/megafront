import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store'; // Adjust path as needed


export default function TownshipVideos() {
  const dispatch = useDispatch();
   const videos = useSelector((state: RootState) => state.townshipVideo);

  const [selectedVideo, setSelectedVideo] = useState(videos[0]?.url || "");
 
  return (
 <div className="container mx-auto px-6 py-12">

  {/* Breadcrumb Navigation */}
  <nav className="text-gray-600 text-sm mb-6">
    <a href="/user" className="hover:underline">Home</a> &gt; <span className="text-gray-900 font-semibold">Videos</span>
  </nav>

  {/* Left & Right Layout */}
  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">

    {/* Left Side (Title & Description) */}
    <div className="lg:w-1/2 text-center lg:text-left">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">What's New Videos</h1>
      <p className="text-lg text-gray-700 mb-6">
        In the past 3 decades, Megaworld has evolved from just building properties. It has been building sustainable and 
        future-ready communities with offices, schools, malls, hotels, and transportation facilities.
      </p>
    </div>

    {/* Right Side (Big Video) */}
    <div className="lg:w-1/2 flex justify-center">
      <iframe 
        className="w-full max-w-3xl aspect-video rounded-lg shadow-lg"
        src="https://www.youtube.com/embed/xP-jwXHDTrU"
        title="Selected Video"
        allowFullScreen
      />
    </div>

  </div>

  {/* Video Thumbnails at Bottom */}
 <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {videos.map((video) => {
    // Ensure all URLs are in the correct embed format
    let embedUrl = video.url.includes("watch?v=") 
      ? video.url.replace("watch?v=", "embed/") 
      : video.url;

    return (
      <div 
        key={video.id} 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        {/* Embedded Video */}
        <iframe 
          className="w-full h-40" 
          src={embedUrl} 
          title={video.title}
          allowFullScreen
        />

        {/* Video Details */}
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">{video.title}</h2>
          <p className="text-sm text-gray-600">{video.location} • {video.date}</p>
          <p className="text-sm text-gray-500">{video.views} views</p>
        </div>
      </div>
    );
  })}
</div>


</div>

  );
}
