import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// List of categories (adjust as you need)
const categories = [
  "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance"
];

const getDetailLink = (type, id) => {
  switch(type) {
    case "events": return `/event/${id}`;
    case "stories": return `/stories/${id}`;
    case "advertisements": return `/advertisements/${id}`;
    default: return `/${type}/${id}`;
  }
};

// Horizontal scroll section for a resource type
const ScrollSection = ({ title, items, type }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-3 text-orange-700">{title}</h2>
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-orange-400">
      {items.map(item => (
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
            <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {(item.date ? new Date(item.date).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "")}
            </p>
            {type === "events" && (
              <p className="text-xs text-gray-500">
                {item.district || "No district"} | {item.category}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [events, setEvents] = useState([]);
  const [stories, setStories] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // All endpoints filter by category
        const [eventsRes, storiesRes, adsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/events?category=${encodeURIComponent(selectedCategory)}`),
          axios.get(`http://localhost:5000/api/stories?category=${encodeURIComponent(selectedCategory)}`),
          axios.get(`http://localhost:5000/api/advertisements?category=${encodeURIComponent(selectedCategory)}`)
        ]);
        setEvents(eventsRes.data.events || []);
        setStories(storiesRes.data.stories || storiesRes.data || []);
        setAds(adsRes.data.ads || adsRes.data || []);
      } catch (err) {
        setEvents([]); setStories([]); setAds([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-56 bg-white rounded-2xl shadow-md m-4 p-4 sticky top-24 h-fit">
        <h3 className="text-lg font-bold mb-3 text-orange-700">Categories</h3>
        <div className="hidden md:block">
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition
                    ${selectedCategory === cat ? "bg-orange-100 text-orange-800 shadow" : "text-gray-700 hover:bg-orange-50"}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Mobile: Use dropdown */}
        <div className="md:hidden">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-orange-300 bg-white text-orange-700 font-semibold shadow"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-2 md:p-8">
        <h2 className="text-2xl font-extrabold mb-6 text-gray-900">{selectedCategory} — Local Category Updates</h2>
        {loading ? (
          <div className="text-center text-orange-500 py-20">Loading...</div>
        ) : (
          <>
            <ScrollSection title="Events" items={events} type="events" />
            <ScrollSection title="Stories" items={stories} type="stories" />
            <ScrollSection title="Advertisements" items={ads} type="advertisements" />
          </>
        )}
      </main>
    </div>
  );
}
