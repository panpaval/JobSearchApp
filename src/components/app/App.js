import React from "react";
import { useState } from "react";
import Header from "../header/Header";
import SearchPanel from "../search/Search";
import Filter from "../filter/Filter";
import JobList from "../jobList/JobList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./app.css";
import FavoritesList from "../favorites/Favorites";
import JobDescription from "../jobdescription/jobdescription";

export const JobsContext = React.createContext();

const initialFilters = {
  industry: "",
  salaryMin: "",
  salaryMax: "",
  country: "us",
};

function App() {
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false); //

  const [data, setData] = useState([]);
  const [pageForRequest, setPageForRequest] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPages, setLoadedPages] = useState([]); // Использоаваные страницы пагинации кратные пяти
  const [usedPages, setUsedPages] = useState(0); //Использованые станицы для запросов на сервер

  const [filters, setFilters] = useState(initialFilters);
  const [firstRequest, setFirstRequest] = useState([]); //первая порция данных по инициализирующему запросу для списка. Используется при клике на "сбросить всё"
  const [selectedJobId, setSelectedJobId] = useState(null); //для JobDescription
  const [favorites, setFavorites] = useState([]);
  const [activeLink, setActiveLink] = useState("search"); //для активных ссылок в хедере
  const [isJobDescriptionPage, setIsJobDescriptionPage] = useState(false); //для цвета шрифта названия вакансии внутри JobDescription

  return (
    <Router>
      <JobsContext.Provider
        value={{
          isMobileSearchVisible, //
          setIsMobileSearchVisible, //
          firstRequest,
          isJobDescriptionPage,
          setIsJobDescriptionPage,
          setFirstRequest,
          filters,
          setFilters,
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
                        {" "}
                        {/* переносим поиск над фильтрами */}
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
                    <div className="container favorites">
                      <div className="favorites-content">
                        <FavoritesList />
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/job/:id"
                  element={
                    <div className="container favorites">
                      <div>
                        <JobDescription />
                      </div>
                    </div>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </JobsContext.Provider>
    </Router>
  );
}

export default App;
