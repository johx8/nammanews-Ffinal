import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Utility
function getYouTubeVideoID(url) {
  if (!url) return '';
  const regExp = /^.*(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : '';
}

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/videos')
      .then(res => setVideos(Array.isArray(res.data.videos) ? res.data.videos : res.data))
      .catch(err => setVideos([]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-3">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-700 mb-10 text-center">Video Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {videos.length === 0 && (
            <div className="text-gray-400 col-span-full text-center pt-10 text-lg font-semibold">
              No videos available.
            </div>
          )}

          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-orange-100 transition-all duration-200 overflow-hidden flex flex-col h-full group min-h-[390px] max-h-[420px]"
            >
              <h3 className="text-xl font-extrabold text-orange-700 px-5 pt-5 pb-2 truncate">{video.title}</h3>
              <p className="text-gray-600 px-5 text-sm mb-2 line-clamp-2">{video.description}</p>

              {/* Video area: always same height for consistency */}
              <div className="flex-1 flex items-center justify-center px-3 pb-3">
                {video.videoUrl ? (
                  <video
                    controls
                    className="rounded-xl w-full h-[210px] object-cover bg-gray-100 border border-orange-100 shadow group-hover:scale-[1.02] transition duration-300"
                  >
                    <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : video.youtubeLink ? (
                  <a
                    href={video.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    title="Watch on YouTube"
                  >
                    <img
                      src={
                        getYouTubeVideoID(video.youtubeLink)
                          ? `https://img.youtube.com/vi/${getYouTubeVideoID(video.youtubeLink)}/hqdefault.jpg`
                          : "https://via.placeholder.com/360x200?text=YouTube"
                      }
                      alt="YouTube thumbnail"
                      className="rounded-xl w-full h-[210px] object-cover bg-gray-100 border border-orange-100 shadow group-hover:scale-[1.02] transition duration-300"
                    />
                    <span className="absolute bottom-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg z-10 pointer-events-none opacity-90">
                      YouTube
                    </span>
                  </a>
                ) : (
                  <div className="text-red-500 text-sm font-bold">
                    No video or link provided.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;
