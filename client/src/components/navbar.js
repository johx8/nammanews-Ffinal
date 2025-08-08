import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./navbar.css";
import logo from "../imgs/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");
    if (storedName) setUserName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    window.location.reload();
    setRole(null);
    setUserName(null);
  };

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "kn" : "en");
  }

  return (
    <nav className="bg-white shadow-md border-b relative flex items-center justify-between px-4 py-2">
      <Link to="/" className="flex">
        <img src={logo} alt="NammaEvents Logo" className="w-20 md:w-35 lg:w-25" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4 text-sm md:text-base items-center">
        <Link to="/" className="opts font-semibold">{t("navbar.home")}</Link>
        <Link to="/districts" className="opts font-semibold">{t("navbar.districts")}</Link>
        <Link to="/events" className="opts font-semibold">{t("navbar.events")}</Link>
        <Link to="/stories" className="opts font-semibold">{t("navbar.stories")}</Link>
        <Link to="/videos" className="opts font-semibold">{t("navbar.videos")}</Link>
        <Link to="/calendar" className="opts font-semibold">{t("navbar.calendar")}</Link>
        <Link to="/categories" className="opts font-semibold">{t("navbar.categories")}</Link>
        
        {/* Language Switch */}
        <button
          onClick={toggleLang}
          className="opts bg-orange-100 text-orange-600 px-3 py-1 rounded"
        >
          {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
        </button>

        {userName ? (
          <>
            <Link to={role === 'admin' ? "/admin/dashboard" : "/user/profile"} className="opts font-semibold">
              {t("navbar.greeting", { name: userName })}
            </Link>
            <button onClick={handleLogout} className="opts text-orange-600 font-semibold">
              {t("navbar.logout")}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="opts text-orange-600 font-semibold">
              {t("navbar.login")}
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button onClick={toggleMenu} className="md:hidden">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full bg-white shadow-md z-10 md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            <Link to="/" onClick={toggleMenu} className="opts font-semibold">{t("navbar.home")}</Link>
            <Link to="/districts" onClick={toggleMenu} className="opts font-semibold">{t("navbar.districts")}</Link>
            <Link to="/events" onClick={toggleMenu} className="opts font-semibold">{t("navbar.events")}</Link>
            <Link to="/stories" onClick={toggleMenu} className="opts font-semibold">{t("navbar.stories")}</Link>
            <Link to="/videos" onClick={toggleMenu} className="opts font-semibold">{t("navbar.videos")}</Link>
            <Link to="/calendar" onClick={toggleMenu} className="opts font-semibold">{t("navbar.calendar")}</Link>
            <Link to="/categories" onClick={toggleMenu} className="opts font-semibold">{t("navbar.categories")}</Link>
            {/* Language Switch */}
            <button
              onClick={() => {toggleMenu(); toggleLang();}}
              className="opts bg-orange-100 text-orange-600 px-3 py-1 rounded"
            >
              {i18n.language === "en" ? "ಕನ್ನಡ" : "English"}
            </button>
            {userName ? (
              <>
                <Link to={role === 'admin' ? "/admin/dashboard" : "/user/profile"} onClick={toggleMenu} className="opts font-semibold">
                  {t("navbar.greeting", { name: userName })}
                </Link>
                <button onClick={() => { toggleMenu(); handleLogout(); }} className="opts text-orange-600 font-semibold">
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMenu} className="opts text-orange-600 font-semibold">
                  {t("navbar.login")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
