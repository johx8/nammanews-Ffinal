import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./navbar.css";
import logo from "../imgs/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    if (storedName) setUserName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "kn" : "en");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md font-semibold transition-colors duration-200 ${
      isActive ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-700 hover:text-orange-600"
    }`;

  return (
    <nav className="bg-white shadow-md border-b relative flex items-center justify-between px-4 py-2">
      {/* Logo */}
      <NavLink to="/" className="flex items-center">
        <img src={logo} alt="NammaEvents Logo" className="w-20 transition-transform hover:scale-105" />
      </NavLink>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-4 items-center text-sm md:text-base">
        <NavLink to="/" className={navLinkClass}>{t("navbar.home")}</NavLink>
        <NavLink to="/districts" className={navLinkClass}>{t("navbar.districts")}</NavLink>
        <NavLink to="/events" className={navLinkClass}>{t("navbar.events")}</NavLink>
        <NavLink to="/stories" className={navLinkClass}>{t("navbar.stories")}</NavLink>
        <NavLink to="/videos" className={navLinkClass}>{t("navbar.videos")}</NavLink>
        <NavLink to="/calendar" className={navLinkClass}>{t("navbar.calendar")}</NavLink>
        <NavLink to="/categories" className={navLinkClass}>{t("navbar.categories")}</NavLink>

        {/* Lang Button */}
        <button
          onClick={toggleLang}
          className="px-4 py-1 rounded-full border border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition"
        >
          {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
        </button>

        {userName ? (
          <>
            <NavLink to={role === "admin" ? "/admin/dashboard" : "/user/profile"} className={navLinkClass}>
              {t("navbar.greeting", { name: userName })}
            </NavLink>
            <button onClick={handleLogout} className="text-orange-600 font-semibold hover:underline">
              {t("navbar.logout")}
            </button>
          </>
        ) : (
          <NavLink to="/login" className="text-orange-600 font-semibold hover:underline">
            {t("navbar.login")}
          </NavLink>
        )}
      </div>

      {/* Mobile Toggle */}
      <button onClick={toggleMenu} className="md:hidden">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col space-y-3 p-4">
          <NavLink to="/" onClick={toggleMenu} className={navLinkClass}>{t("navbar.home")}</NavLink>
          <NavLink to="/districts" onClick={toggleMenu} className={navLinkClass}>{t("navbar.districts")}</NavLink>
          <NavLink to="/events" onClick={toggleMenu} className={navLinkClass}>{t("navbar.events")}</NavLink>
          <NavLink to="/stories" onClick={toggleMenu} className={navLinkClass}>{t("navbar.stories")}</NavLink>
          <NavLink to="/videos" onClick={toggleMenu} className={navLinkClass}>{t("navbar.videos")}</NavLink>
          <NavLink to="/calendar" onClick={toggleMenu} className={navLinkClass}>{t("navbar.calendar")}</NavLink>
          <NavLink to="/categories" onClick={toggleMenu} className={navLinkClass}>{t("navbar.categories")}</NavLink>

          {/* Lang Button */}
          <button
            onClick={() => { toggleMenu(); toggleLang(); }}
            className="px-4 py-1 rounded-full border border-orange-500 text-orange-600 font-bold hover:bg-orange-500 hover:text-white transition"
          >
            {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
          </button>

          {userName ? (
            <>
              <NavLink to={role === "admin" ? "/admin/dashboard" : "/user/profile"} onClick={toggleMenu} className={navLinkClass}>
                {t("navbar.greeting", { name: userName })}
              </NavLink>
              <button onClick={() => { toggleMenu(); handleLogout(); }} className="text-orange-600 font-semibold hover:underline">
                {t("navbar.logout")}
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={toggleMenu} className="text-orange-600 font-semibold hover:underline">
              {t("navbar.login")}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
