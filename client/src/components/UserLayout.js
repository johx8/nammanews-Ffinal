import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebarDash';

const UserLayout = () => {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 md:ml-60 bg-gray-50 p-4 pt-20 md:pt-6 ">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
