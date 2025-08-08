import React, { useState } from 'react';
import axios from 'axios';

const UploadStoryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    district: '',
    category: '',
    youtubeLink: ''
  });
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');

  const districts = [
    "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada","Vijayanagara", "Vijayapura", "Yadgiri"];
  const categories = [
    "Business", "Dance", "Education", "Health", "Food", "Arts", "Workshop", "Finance"];

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) data.append(key, formData[key]);
      if (image) data.append('image', image);

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/stories', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess('Story uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        district: '',
        category: '',
        youtubeLink: ''
      });
      setImage(null);
    } catch (err) {
      console.error('Story upload failed:', err);
      setSuccess('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Add New Story</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border p-2" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border p-2" rows="4" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2" required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full border p-2" required />
        <select name="district" value={formData.district} onChange={handleChange} className="input" required>
          <option value="">Select District</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* <input name="subDistrict" value={formData.subDistrict} onChange={handleChange} placeholder="Sub-location (Optional)" className="input" /> */}

        <select name="category" value={formData.category} onChange={handleChange} className="input" required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="w-full border p-2" required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full border p-2" required /> */}
        <input type="url" name="youtubeLink" placeholder="YouTube Link (Optional)" value={formData.youtubeLink} onChange={handleChange} className="w-full border p-2" />
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload Story</button>
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
};

export default UploadStoryForm;
