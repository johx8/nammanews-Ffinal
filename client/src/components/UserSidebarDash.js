import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const UserSidebarDash = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navItemClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive ? 'bg-orange-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  const toggleLang = () => i18n.changeLanguage(i18n.language === "en" ? "kn" : "en");

  return (
    <>
      <div className="hidden md:block fixed top-16 left-0 h-full w-60 bg-white border-r shadow-lg p-4 z-40">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-orange-600">{t("user.dashboard")}</h1>
          <button
            onClick={toggleLang}
            className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm"
          >
            {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/user/profile" className={navItemClass}>{t("user.editProfile")}</NavLink>
          <NavLink to="/user/add-event" className={navItemClass}>{t("user.submitEvents")}</NavLink>
          <NavLink to="/user/my-events" className={navItemClass}>{t("user.myEvents")}</NavLink>
          <NavLink to="/user/my-registrations" className={navItemClass}>{t("user.myRegistrations")}</NavLink>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b p-4 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600">{t("user.dashboard")}</h1>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)}>☰</button>
        <button
          onClick={toggleLang}
          className="ml-4 text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm"
        >
          {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white border-t p-4 z-40">
          <nav className="flex flex-col gap-2">
            <NavLink to="/user/profile" className={navItemClass}>{t("user.editProfile")}</NavLink>
            <NavLink to="/user/add-event" className={navItemClass}>{t("user.submitEvents")}</NavLink>
            <NavLink to="/user/my-events" className={navItemClass}>{t("user.myEvents")}</NavLink>
            <NavLink to="/user/my-registrations" className={navItemClass}>{t("user.myRegistrations")}</NavLink>
          </nav>
        </div>
      )}
    </>
  );
};

export default UserSidebarDash;
