import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { JobsContext } from "../app/App";
import logoImage from "./Logo.svg";
import { Burger, Drawer, Stack } from "@mantine/core";
import { Search } from "tabler-icons-react";
import "./header.css";

const Header = () => {
  const { activeLink, setActiveLink, setIsMobileSearchVisible } =
    useContext(JobsContext);
  const location = useLocation();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/") {
      setActiveLink("search");
    } else if (currentPath === "/favorites") {
      setActiveLink("favorites");
    }
  }, [location.pathname, setActiveLink]);

  const handleClick = (link) => {
    setActiveLink(link);
    setOpened(false);
  };

  const handleSearchIconClick = () => {
    setIsMobileSearchVisible((prev) => !prev);
  }; //тоглим строку поиска

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className={`header-link ${activeLink === "search" ? "active" : ""}`}
        onClick={() => handleClick("search")}
      >
        Поиск вакансий
      </Link>
      <Link
        to="/favorites"
        className={`header-link ${activeLink === "favorites" ? "active" : ""}`}
        onClick={() => handleClick("favorites")}
      >
        Избранное
      </Link>
    </>
  );

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
        <div className="mobile-search-icon">
          <Search size={24} onClick={handleSearchIconClick} />
        </div>{" "}
        {/* иконка лупы */}
        <nav className="header-nav desktop-nav">
          <NavLinks />
        </nav>
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          className="mobile-burger"
          size="lg"
        />
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          size="100%"
          padding="md"
          title="Меню"
          className="mobile-drawer"
          position="left"
        >
          <Stack>
            <NavLinks />
          </Stack>
        </Drawer>
      </header>
    </div>
  );
};

export default Header;

/* import "./header.css";
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
 */
