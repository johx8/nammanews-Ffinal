import React, { useState } from 'react';
import axios from 'axios';

const UploadVideoForm = () => {
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    youtubeLink: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    setVideoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile && !videoData.youtubeLink) {
      setUploadStatus('❌ Please upload a video or provide a YouTube link.');
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('youtubeLink', videoData.youtubeLink);
    if (videoFile) formData.append('video', videoFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadStatus('✅ Video uploaded successfully!');
      setVideoData({ title: '', description: '', youtubeLink: '' });
      setVideoFile(null);
      setVideoPreview(null);
    } catch (err) {
      console.error('Video upload error:', err);
      setUploadStatus('❌ Failed to upload video.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-8">
      <div className="w-full max-w-lg mx-auto rounded-2xl bg-white shadow-2xl px-7 py-10 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-8 text-orange-700 tracking-tight text-center">
          Upload Video or YouTube Link
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Title <span className="text-orange-600">*</span></label>
            <input
              type="text"
              name="title"
              value={videoData.title}
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
              placeholder="Video Title"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Description <span className="text-orange-600">*</span></label>
            <textarea
              name="description"
              value={videoData.description}
              onChange={handleChange}
              rows={3}
              required
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 bg-gray-50 resize-y"
              placeholder="Describe the video"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block font-semibold text-gray-700">Upload MP4 Video</label>
              <span className="text-xs text-gray-400">(optional)</span>
            </div>
            <input
              type="file"
              name="video"
              accept="video/mp4"
              onChange={handleFileChange}
              disabled={submitting}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:outline-none"
            />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-3 w-full rounded-xl shadow border object-contain max-h-56"
              />
            )}
          </div>
          <div className="text-center text-gray-400 font-semibold">— or —</div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">YouTube Link <span className="text-gray-400 text-xs">(optional)</span></label>
            <input
              type="url"
              name="youtubeLink"
              value={videoData.youtubeLink}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 text-base bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full mt-2 py-3 rounded-xl text-lg font-bold shadow-md transition bg-orange-600 hover:bg-orange-700 text-white focus:ring-2 focus:ring-orange-400 focus:outline-none
              ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {submitting ? "Uploading..." : "Upload"}
          </button>

          {uploadStatus && (
            <div className={`mt-6 text-center text-base font-semibold rounded-xl py-2 px-4
              ${uploadStatus.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {uploadStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadVideoForm;
