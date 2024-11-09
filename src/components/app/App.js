import React from "react";
import { useState, useEffect } from "react";
import Header from "../header/Header";
import SearchPanel from "../search/Search";
import Filter from "../filter/Filter";
import JobList from "../jobList/JobList";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "./app.css";
import FavoritesList from "../favorites/Favorites";
import JobDescription from "../jobdescription/jobdescription.js";

export const JobsContext = React.createContext();

/* const defaultFilters = {
  industry: "",
  salaryMin: "",
  salaryMax: "",
  country: "us",
}; */

const defaultFilters = {
  industry: "",
  salaryMin: "",
  salaryMax: "",
  country: "us",
  region: "", // добавляем регион
};

function App() {
  const location = useLocation();
  const [resetForIndustry, setResetForIndustry] = useState(false); //для сброса индустрии в фильтре при запросе через строку поиска
  const [searchParams, setSearchParams] = useSearchParams();
  /*   const initialFilters = {
    industry: searchParams.get("industry") || "",
    salaryMin: searchParams.get("salaryMin") || "",
    salaryMax: searchParams.get("salaryMax") || "",
    country: searchParams.get("country") || "us",
  }; */
  const initialFilters = {
    industry: searchParams.get("industry") || "",
    salaryMin: searchParams.get("salaryMin") || "",
    salaryMax: searchParams.get("salaryMax") || "",
    country: searchParams.get("country") || "us",
    region: searchParams.get("region") || "", // добавляем регион
  };
  console.log("URLfromAPP", searchParams);
  console.log("initialFilters", initialFilters);

  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false); //

  const [data, setData] = useState([]);
  const [pageForRequest, setPageForRequest] = useState(1);
  /* const [keyword, setKeyword] = useState(""); */
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState([]); // Использоаваные страницы пагинации кратные пяти
  const [usedPages, setUsedPages] = useState(0); //Использованые станицы для запросов на сервер

  /* const [filters, setFilters] = useState(initialFilters); */

  const [firstRequest, setFirstRequest] = useState([]); //первая порция данных по инициализирующему запросу для списка. Используется при клике на "сбросить всё"
  const [selectedJobId, setSelectedJobId] = useState(null); //для JobDescription
  /* const [favorites, setFavorites] = useState([]); */
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  const [activeLink, setActiveLink] = useState("search"); //для активных ссылок в хедере
  const [isJobDescriptionPage, setIsJobDescriptionPage] = useState(false); //для цвета шрифта названия вакансии внутри JobDescription
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  /*   const [filters, setFilters] = useState(() => {
    const savedFilters = sessionStorage.getItem("filters");
    if (savedFilters) {
      return JSON.parse(savedFilters);
    } else {
      const salaryMin = searchParams.get("salaryMin");
      const salaryMax = searchParams.get("salaryMax");
      return {
        industry: searchParams.get("industry") || "",
        salaryMin: salaryMin ? Number(salaryMin) : "",
        salaryMax: salaryMax ? Number(salaryMax) : "",
        country: searchParams.get("country") || "us",
      };
    }
  });
 */

  const [filters, setFilters] = useState(() => {
    const savedFilters = sessionStorage.getItem("filters");
    if (savedFilters) {
      return JSON.parse(savedFilters);
    } else {
      const salaryMin = searchParams.get("salaryMin");
      const salaryMax = searchParams.get("salaryMax");
      return {
        industry: searchParams.get("industry") || "",
        salaryMin: salaryMin ? Number(salaryMin) : "",
        salaryMax: salaryMax ? Number(salaryMax) : "",
        country: searchParams.get("country") || "us",
        region: searchParams.get("region") || "", // добавляем регион
      };
    }
  });
  useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (location.pathname === "/") {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      // Добавляем ключевое слово
      if (keyword) {
        params.set("keyword", keyword);
      }
      setSearchParams(params);
    }
  }, [filters, location.pathname, setSearchParams, keyword]);

  return (
    <JobsContext.Provider
      value={{
        resetForIndustry,
        setResetForIndustry,
        isMobileSearchVisible,
        setIsMobileSearchVisible,
        firstRequest,
        isJobDescriptionPage,
        setIsJobDescriptionPage,
        setFirstRequest,
        filters,
        setFilters,
        /* setFilters: updateFilters, */ //добавили
        keyword,
        setKeyword,
        loadingMore,
        setLoadingMore,
        currentPage,
        setCurrentPage,
        data,
        setData,
        loadedPages,
        setLoadedPages,
        pageForRequest,
        setPageForRequest,
        usedPages,
        setUsedPages,
        initialFilters,
        defaultFilters,
        selectedJobId,
        setSelectedJobId,
        favorites,
        setFavorites,
        activeLink,
        setActiveLink,
      }}
    >
      <div className="content-wrap">
        <Header />
        <div className="main">
          <div className="container">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="mobile-search">
                      <SearchPanel />
                    </div>
                    <div className="filter-wrap">
                      <Filter />
                    </div>
                    <div className="frame">
                      <div className="desktop-search">
                        <SearchPanel />
                      </div>
                      <JobList />
                    </div>
                  </>
                }
              />
              <Route
                path="/favorites"
                element={
                  <div className=" favorites">
                    <div className="favorites-content">
                      <FavoritesList />
                    </div>
                  </div>
                }
              />
              <Route
                path="/job/:country/:id"
                element={
                  <div className="container favorites">
                    <div style={{ margin: "0 auto" }}>
                      <JobDescription />
                    </div>
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              {/* добавил для исправления бага */}
            </Routes>
          </div>
        </div>
      </div>
    </JobsContext.Provider>
  );
}

export default App;
