// Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const getDetailLink = (type, id) => {
  switch (type) {
    case "events": return `/event/${id}`;
    case "advertisements": return `/advertisements/${id}`;
    case "stories": return `/stories/${id}`;
    default: return `/${type}/${id}`;
  }
};

const ScrollSection = ({ title, items, type }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-3 text-orange-700">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-orange-400">
        {items.map((item) => (
          <Link
             to={getDetailLink(type, item._id)}
             key={item._id}
            className="min-w-[250px] bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 snap-start flex-shrink-0"
          >
            <img
              src={
                item.imageUrl
                  ? item.imageUrl.startsWith("http")
                    ? item.imageUrl
                    : `http://localhost:5000${item.imageUrl}`
                  : "https://via.placeholder.com/250x150?text=No+Image"
              }
              alt={item.title}
              className="w-full h-36 object-cover rounded-t-lg"
            />
            <div className="p-3">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {item.title}
              </h3>
              {type === "events" && (
                <p className="text-xs text-gray-500">
                  {item.district || "No district"} | {item.category}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {item.date
                  ? new Date(item.date).toLocaleDateString()
                  : item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};



const Home = () => {
  const [events, setEvents] = useState([]);
  const [stories, setStories] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eventsRes, storiesRes, adsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/events"),
          axios.get("http://localhost:5000/api/stories"),
          axios.get("http://localhost:5000/api/advertisements", {
            withCredentials: true,
          }),
        ]);

        setEvents(
          Array.isArray(eventsRes.data.events)
            ? eventsRes.data.events
            : eventsRes.data
        );
        setStories(storiesRes.data);
        setAds(
          Array.isArray(adsRes.data)
            ? adsRes.data
            : adsRes.data.ads || []
        );
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-orange-700">
        Discover What’s Happening in Karnataka
      </h1>

      <ScrollSection title="Latest Events" items={events} type="events" />
      <ScrollSection title="Latest Stories" items={stories} type="stories" />
      <ScrollSection
        title="Advertisements"
        items={ads.map((ad) => ({
          ...ad,
          title: ad.title || "Sponsored",
          imageUrl: ad.imageUrl,
          _id: ad._id,
        }))}
        type="advertisements"
      />
    </div>
  );
};

export default Home;
