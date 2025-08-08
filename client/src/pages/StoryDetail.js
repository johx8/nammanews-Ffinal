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

  if (!story) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      {story.imageUrl && <img src={`http://localhost:5000${story.imageUrl}`} alt="Story" className="w-full h-96 object-cover mb-4" />}
      <h1 className="text-3xl font-bold mb-2 leading-snug text-gray-800">{story.title}</h1>
          <p className="text-md text-gray-600 mb-3 italic">{story.district} | {story.category}</p>
          <p className="text-gray-700 text-lg">{story.description}</p>
      {story.youtubeLink && (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${story.youtubeLink.split('v=')[1]}`}
            frameBorder="0"
            allowFullScreen
            title="YouTube Video"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default StoryDetail;
