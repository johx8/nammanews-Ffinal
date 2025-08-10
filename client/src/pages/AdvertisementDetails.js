import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdvertisementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/advertisements/${id}`)
      .then((res) => setAd(res.data))
      .catch(() => setAd(null));
  }, [id]);

  if (!ad)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Loading...
      </div>
    );

  const {
    title,
    description,
    imageUrl,
    category,
    district,
    contact,
    createdAt,
  } = ad;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-lg mt-8 animate-fadeIn">
      {/* Image - fills width, maintains aspect, no empty space */}
      {imageUrl && (
        <div className="w-full mb-7 aspect-[16/9] overflow-hidden rounded-xl shadow-md bg-gray-100">
          <img
            src={
              imageUrl.startsWith("http")
                ? imageUrl
                : `http://localhost:5000${imageUrl}`
            }
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            style={{ display: "block" }}
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-1 text-gray-800 leading-snug">
        {title}
      </h1>

      {/* Meta Info */}
      <p className="text-sm text-gray-500 mb-5">
        📍 {district} | 🏷 {category} | 📅{" "}
        {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
      </p>

      {/* Description */}
      <div className="mb-6">
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>

      {/* Contact Section */}
      {contact && (
        <div className="mb-10 px-6 py-4 bg-orange-50 rounded-xl flex items-center gap-2 shadow-sm text-orange-700 font-semibold text-base">
          <span className="text-lg mr-1">📞</span>
          For further questions or queries, contact:
          <span className="ml-2 underline underline-offset-4 decoration-orange-400 break-all">{contact}</span>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-md"
      >
        ← Back
      </button>
    </div>
  );
};

export default AdvertisementDetail;
