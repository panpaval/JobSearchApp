import { useState, useContext, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { JobsContext } from "../app/App";
import logoImage from "./Logo.svg";
import { Burger, Drawer, Stack } from "@mantine/core";
import { Search } from "tabler-icons-react";
import ReactCountryFlag from "react-country-flag";
import "./header.css";

const Header = () => {
  const {
    activeLink,
    setActiveLink,
    setIsMobileSearchVisible,
    filters,
    setFilters,
  } = useContext(JobsContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [opened, setOpened] = useState(false);

  // Функция для извлечения кода страны из URL
  const getCountryFromUrl = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "job" && pathParts[2]) {
      return pathParts[2];
    }
    return null;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/") {
      setActiveLink("search");
    } else if (currentPath === "/favorites") {
      setActiveLink("favorites");
    }
  }, [location.pathname, setActiveLink]);

  /*   const handleClick = (link) => {
    setActiveLink(link);
    setOpened(false);
  }; */
  /* 
  const handleClick = (link) => {
    setActiveLink(link);

    setOpened(false);

    if (link === "search") {
      const currentParams = Object.fromEntries([...searchParams]);

      console.log("SearchPARAMS", currentParams);

      setFilters((prevFilters) => ({
        ...prevFilters,
        ...currentParams,
      }));

      navigate("/");
    } else if (link === "favorites") {
      navigate("/favorites");
    }
  }; */

  const handleClick = (link) => {
    setActiveLink(link);
    setOpened(false);

    if (link === "search") {
      const savedFilters = JSON.parse(
        sessionStorage.getItem("filters") || "{}"
      );
      setFilters(savedFilters);
      navigate("/");
    } else if (link === "favorites") {
      navigate("/favorites");
    }
  };

  const handleSearchIconClick = () => {
    setIsMobileSearchVisible((prev) => !prev);
  }; //тоглим строку поиска

  const countryCode = (
    getCountryFromUrl() ||
    filters.country ||
    "us"
  ).toUpperCase();

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
            {/* <img src={logoImage} alt="Logo" className="logo-image" /> */}
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{
                width: "3em",
                height: "2em",
              }}
              title={countryCode}
            />
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
