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
          users: (res.data.userCount - 1),
          events: res.data.eventCount,
          advertisements: res.data.adCount || 0,
          stories: res.data.storyCount || 0,
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
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Card details for mapping over
  const cardData = [
    { label: 'Total Events', value: stats.events, bg: 'bg-blue-500', icon: '📅' },
    { label: 'Total Users', value: stats.users, bg: 'bg-purple-500', icon: '👥' },
    { label: 'Total Stories', value: stats.stories, bg: 'bg-orange-500', icon: '📖' },
    { label: 'Total Advertisements', value: stats.advertisements, bg: 'bg-green-500', icon: '📢' },
    { label: 'Current Time', value: stats.dateTime, bg: 'bg-yellow-800', icon: '⏰' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900 text-center tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            className={`${card.bg} rounded-2xl shadow-lg p-6 flex flex-col items-start sm:items-center justify-center min-h-[130px] transition-transform duration-200 hover:scale-105`}
          >
            <span className="text-4xl mb-2">{card.icon}</span>
            <h2 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">{card.label}</h2>
            <p className="text-2xl sm:text-3xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;
