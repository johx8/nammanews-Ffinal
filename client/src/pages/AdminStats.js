import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    advertisements: 0,
    stories: 0,
    dateTime: new Date().toLocaleString(),
  });

  useEffect(() => {
    const fetchStats = async () => {
       try {
      const res = await axios.get('http://localhost:5000/api/admin/stats');
      setStats({
        users: (res.data.userCount-1),
        events: res.data.eventCount,
        advertisements: res.data.adCount || 0, // Assuming adCount is returned from the API
        stories: res.data.storyCount || 0, // Assuming storyCount is returned from the
        dateTime: new Date(res.data.currentDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();

    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        dateTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }));
    }, 30000); // update time every 30s

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ml-64 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Total Events</h2>
          <p className="text-2xl">{stats.events}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Total Users</h2>
          <p className="text-2xl">{stats.users}</p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Total Story</h2>
          <p className="text-2xl">{stats.stories}</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Total Advertisement</h2>
          <p className="text-2xl">{stats.advertisements}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Current Time</h2>
          <p>{stats.dateTime}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
