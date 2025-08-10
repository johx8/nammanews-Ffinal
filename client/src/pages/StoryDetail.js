import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/stories/${id}`)
      .then(res => setStory(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <article className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8 animate-fadeIn">
        {/* Banner/Image */}
        {story.imageUrl && (
          <figure className="mb-7 overflow-hidden rounded-2xl shadow-md">
            <img
              src={`http://localhost:5000${story.imageUrl}`}
              alt="Story"
              className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105"
            />
          </figure>
        )}

        {/* Meta, title, subtitle */}
        <header>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {story.category && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">
                {story.category}
              </span>
            )}
            {story.district && (
              <span className="text-gray-500 text-xs flex items-center">
                <span className="mr-1">📍</span>
                {story.district}
              </span>
            )}
            {/* You could add date here if desired */}
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
            {story.title}
          </h1>
        </header>

        {/* Article body */}
        <section className="prose prose-lg max-w-none text-gray-800 mb-6 font-serif">
          {/* Optionally, split long descriptions into paragraphs */}
          {story.description.split('\n').map((par, i) => (
            <p key={i}>{par}</p>
          ))}
        </section>

        {/* YouTube Embed (if any) */}
        {story.youtubeLink && (
          <div className="aspect-video my-8 rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${extractYouTubeID(story.youtubeLink)}`}
              frameBorder="0"
              allowFullScreen
              title="YouTube Video"
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        )}

        {/* Footer or Author Info, if available in future */}
        {/* <footer className="mt-10 text-sm text-gray-400 italic">By ...</footer> */}
      </article>
    </div>
  );
};

// Helper for YouTube links
function extractYouTubeID(url) {
  // Handles both full URL and share links
  if (!url) return '';
  const idMatch = url.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return idMatch ? idMatch[1] : url.split('v=')[1] || url;
}

export default StoryDetail;
