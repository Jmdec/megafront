import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchVideos } from "@/app/redux/services/videoService";

export default function Videos() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos = [], loading, error } = useSelector((state: RootState) => state.townshipVideo);
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  useEffect(() => {
    if (videos.length > 0) {
      setSelectedVideo(videos[0]?.url.replace("watch?v=", "embed/"));
    }
  }, [videos]);

  return (
    <div className="container mx-auto px-6 py-12">

      <nav className="text-gray-600 text-sm mb-6">
        <a href="/user" className="hover:underline">Home</a> &gt; 
        <span className="text-gray-900 font-semibold">Videos</span>
      </nav>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
   
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What's New Videos</h1>
          <p className="text-lg text-gray-700 mb-6">
            In the past 3 decades, Megaworld has evolved from just building properties. It has been building sustainable and 
            future-ready communities with offices, schools, malls, hotels, and transportation facilities.
          </p>
        </div>

 
        <div className="lg:w-1/2 flex justify-center">
          {selectedVideo ? (
            <iframe 
              className="w-full max-w-3xl aspect-video rounded-lg shadow-lg"
              src={selectedVideo}
              title="Selected Video"
              allowFullScreen
            />
          ) : (
            <p className="text-gray-500">No Video Available</p>
          )}
        </div>
      </div>

   
      {loading && <p className="text-center text-gray-500">Loading videos...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 1 ? (
          videos.slice(1).map((video) => {
            let embedUrl = video.url.includes("watch?v=")
              ? video.url.replace("watch?v=", "embed/")
              : video.url;

            return (
              <div 
                key={video.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedVideo(embedUrl)}
              >
                <iframe 
                  className="w-full h-40" 
                  src={embedUrl} 
                  title={video.title}
                  allowFullScreen
                />
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-900">{video.title}</h2>
                  <p className="text-sm text-gray-600">{video.location} • {video.date}</p>
                  <p className="text-sm text-gray-500">{video.views} views</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">No Other Videos Available</p>
        )}
      </div>
    </div>
  );
}
