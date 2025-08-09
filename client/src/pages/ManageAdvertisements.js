import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdvertisementsAdmin() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/advertisements`, {
        withCredentials: true,
      });

      const adsArray = Array.isArray(res.data) ? res.data : res.data.ads || [];
      setAds(adsArray);
    } catch (err) {
      console.error("Error fetching advertisements:", err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;

    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/advertisements/${id}`, {
        withCredentials: true,
        headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}` // or your admin token source
  }
      });
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (err) {
      console.error("Error deleting advertisement:", err);
      alert("Failed to delete advertisement.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <p className="p-4">Loading advertisements...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Advertisements</h1>
      {ads.length === 0 ? (
        <p>No advertisements found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">District</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad._id}>
                  <td className="border border-gray-300 px-4 py-2">{ad.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{ad.district}</td>
                  <td className="border border-gray-300 px-4 py-2">{ad.category}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => deleteAd(ad._id)}
                      disabled={deleting === ad._id}
                      className={`px-3 py-1 rounded text-white ${
                        deleting === ad._id ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {deleting === ad._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
