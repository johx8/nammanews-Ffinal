import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdvertisementsAdmin() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line
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
          Authorization: `Bearer ${localStorage.getItem("token")}`
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

  if (loading) return (
    <div className="min-h-[60vh] flex justify-center items-center text-lg text-gray-500">
      Loading advertisements...
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-orange-700 tracking-tight text-center sm:text-left">
        Manage Advertisements
      </h1>
      {ads.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-6 text-gray-500 text-center">
          No advertisements found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-orange-50">
                <th className="p-4 font-semibold text-left text-gray-700">Title</th>
                <th className="p-4 font-semibold text-left text-gray-700">District</th>
                <th className="p-4 font-semibold text-left text-gray-700">Category</th>
                <th className="p-4 font-semibold text-left text-gray-700">Date</th>
                <th className="p-4 font-semibold text-center text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad, idx) => (
                <tr key={ad._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 font-medium text-gray-900">{ad.title}</td>
                  <td className="p-4 text-gray-600">{ad.district}</td>
                  <td className="p-4">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {ad.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteAd(ad._id)}
                      disabled={deleting === ad._id}
                      className={`px-4 py-2 rounded-xl font-bold shadow transition ${
                        deleting === ad._id
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300"
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
