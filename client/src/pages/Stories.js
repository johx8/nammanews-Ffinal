import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Stories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stories')
      .then(res => setStories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {stories.map(story => (
        <Link to={`/stories/${story._id}`} key={story._id} className="bg-white shadow rounded overflow-hidden">
          {story.imageUrl && <img src={`http://localhost:5000${story.imageUrl}`} alt="Story" className="w-full h-48 object-cover" />}
          <div className="p-4">
            <h2 className="text-xl font-semibold">{story.title}</h2>
            <p className="text-gray-600">{story.description.slice(0, 100)}...</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Stories;
