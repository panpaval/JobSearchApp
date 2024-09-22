import "./header.css";
import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { JobsContext } from "../app/App";
import logoImage from "./Logo.svg";

const Header = () => {
  const { activeLink, setActiveLink } = useContext(JobsContext);
  const location = useLocation();

  // activeLink изменяется в зависимости от текущего пути, используя useLocation. Это изменение происходит каждый раз при рендере Header
  // оборачиваем в юзэффект с зависимостью [location.pathname, setActiveLink]
  useEffect(() => {
    // Определение активную вкладку на основе текущего пути для смены вкладок при использовании кнопки "назад" в браузере
    const currentPath = location.pathname;
    if (currentPath === "/") {
      setActiveLink("search");
    } else if (currentPath === "/favorites") {
      setActiveLink("favorites");
    }
  }, [location.pathname, setActiveLink]);

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="container-header">
      <header className="header">
        <div className="header-logo">
          <Link
            className="logo-link"
            to="/"
            onClick={() => handleClick("search")}
          >
            <img src={logoImage} alt="Logo" className="logo-image" />
            <div className="logo-text">JobForDubel</div>
          </Link>
        </div>

        <nav className="header-nav">
          <Link
            to="/"
            className={`header-link ${activeLink === "search" ? "active" : ""}`}
            onClick={() => handleClick("search")}
          >
            Поиск вакансий
          </Link>

          <Link
            to="/favorites"
            className={`header-link ${
              activeLink === "favorites" ? "active" : ""
            }`}
            onClick={() => handleClick("favorites")}
          >
            Избранное
          </Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
