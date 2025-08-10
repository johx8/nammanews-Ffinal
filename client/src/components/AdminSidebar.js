import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navItemClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-orange-500 text-white border-l-4 border-orange-700'
        : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'
    }`;

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'kn' : 'en');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-16 left-0 h-full w-60 bg-white border-r shadow-lg p-4 z-40">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold text-orange-600">{t('admin.adminPanel')}</h1>
          
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/admin/dashboard" className={navItemClass}>{t('admin.dashboard')}</NavLink>
          <NavLink to="/admin/add-event" className={navItemClass}>{t('admin.addEvents')}</NavLink>
          <NavLink to="/admin/approve-events" className={navItemClass}>{t('admin.approveEvents')}</NavLink>
          <NavLink to="/admin/manage-events" className={navItemClass}>{t('admin.manageEvents')}</NavLink>
          <NavLink to="/admin/manage-users" className={navItemClass}>{t('admin.manageUsers')}</NavLink>
          <NavLink to="/admin/upload-video" className={navItemClass}>{t('admin.uploadVideo')}</NavLink>
          <NavLink to="/admin/add-story" className={navItemClass}>{t('admin.addStory')}</NavLink>
          <NavLink to="/admin/add-advertisement" className={navItemClass}>{t('admin.addAdvertisement')}</NavLink>
          <NavLink to="/admin/manage-advertisements" className={navItemClass}>{t('admin.manageAdvertisements')}</NavLink>
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b p-4 z-50 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-extrabold text-orange-600">{t('admin.adminPanel')}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="px-3 py-1 rounded-full border border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition"
          >
            {i18n.language === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
          <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-16 left-0 w-60 h-full bg-white shadow-lg border-r transform transition-transform duration-300 z-40 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="/admin/dashboard" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.dashboard')}</NavLink>
          <NavLink to="/admin/add-event" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.addEvents')}</NavLink>
          <NavLink to="/admin/approve-events" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.approveEvents')}</NavLink>
          <NavLink to="/admin/manage-events" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.manageEvents')}</NavLink>
          <NavLink to="/admin/manage-users" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.manageUsers')}</NavLink>
          <NavLink to="/admin/upload-video" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.uploadVideo')}</NavLink>
          <NavLink to="/admin/add-story" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.addStory')}</NavLink>
          <NavLink to="/admin/add-advertisement" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.addAdvertisement')}</NavLink>
          <NavLink to="/admin/manage-advertisements" onClick={() => setIsMobileOpen(false)} className={navItemClass}>{t('admin.manageAdvertisements')}</NavLink>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
