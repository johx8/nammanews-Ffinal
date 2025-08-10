import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Stories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stories')
      .then(res => {
        // If your backend returns { stories: [...] }, use setStories(res.data.stories);
        setStories(res.data.stories || res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-3">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center">All Community Stories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {stories.length === 0 && (
            <div className="text-gray-400 col-span-full text-center pt-10 text-lg font-semibold">
              No stories found.
            </div>
          )}

          {stories.map(story => (
            <Link
              to={`/stories/${story._id}`}
              key={story._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-orange-200 transition-all duration-200 overflow-hidden flex flex-col h-full group"
            >
              <div className="flex-shrink-0 relative">
                <img
                  src={story.imageUrl ? (
                    story.imageUrl.startsWith('http')
                      ? story.imageUrl
                      : `http://localhost:5000${story.imageUrl}`
                  ) : "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={story.title}
                  className="w-full h-52 object-cover object-center bg-gray-100 transition-transform group-hover:scale-105 duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 flex flex-col p-5">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2 truncate">{story.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {story.description.slice(0, 110)}{story.description.length > 110 ? '...' : ''}
                </p>
                <div className="mt-auto flex justify-end">
                  <span className="inline-block bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
                    Read more &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;
