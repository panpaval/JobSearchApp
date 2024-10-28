import React, { useEffect, useContext } from "react";
import { Pagination } from "@mantine/core";
import SkeletonForJobList from "../skeleton/skeleton";
import Item from "../jobItem/JobItem";
import "./jobList.css";
import frameImage from "./Frame.svg";
import { JobsContext } from "../app/App";
import { request } from "../services/Superjobservice";
import { useNavigate, useSearchParams } from "react-router-dom";

const JobList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemsPerPage = 4;

  const {
    data = [],
    setData,
    filters,
    keyword,
    loadingMore,
    setLoadingMore,
    currentPage,
    setCurrentPage,
    loadedPages,
    setLoadedPages,
    pageForRequest,
    setPageForRequest,
    setFirstRequest,
    selectedJobId,
    setSelectedJobId,
  } = useContext(JobsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMore(true);

        // Получаем параметры из URL
        const urlFilters = {
          industry: searchParams.get("industry") || "",
          salaryMin: searchParams.get("salaryMin")
            ? Number(searchParams.get("salaryMin"))
            : "",
          salaryMax: searchParams.get("salaryMax")
            ? Number(searchParams.get("salaryMax"))
            : "",
          country: searchParams.get("country") || "us",
        };

        const urlKeyword = searchParams.get("keyword") || "";

        // Используем параметры из URL для запроса
        const response = await request(urlFilters, urlKeyword);
        setPageForRequest(2);

        setData(response.results);
        setFirstRequest(response.results);
        setLoadingMore(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingMore(false);
      }
    };

    if (data.length === 0) {
      fetchData();
    }
  }, []);

  /*   useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMore(true);
        const response = await request();
        setPageForRequest(2);

        setData(response.results);
        setFirstRequest(response.results);
        setLoadingMore(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingMore(false);
      }
    };

    if (data.length === 0) {
      fetchData();
    }
  }, [data]); */

  const filteredData = data.map((item) => {
    const {
      id,
      title,
      location,
      contract_time,
      salary_min,
      salary_max,
      description,
      redirect_url,
    } = item;

    const country =
      location.area && location.area.length > 0 ? location.area[0] : null;

    return {
      id,
      title,
      location,
      country,
      contract_time,
      salary_min,
      salary_max,
      description,
      redirect_url,
    };
  });

  console.log("DATA FROM LIST", filteredData);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const limitedData = filteredData.slice(startIndex, endIndex);

  const loadMoreData = async () => {
    try {
      setLoadingMore(true);
      const response = await request(filters, keyword, pageForRequest);
      console.log("loadMoreData response", response.results);

      setData([...data, ...response.results]);
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching more data:", error);
      setLoadingMore(false);
    }
  };

  // Пагинация с одним вызовом каждой пятой страницы и задающая параметр page для сервера(setPageForRequest)
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    if (page % 5 === 0) {
      setPageForRequest((prev) => prev + 1);
    }
    console.log("pageForRequest", pageForRequest);
    if (page > currentPage && page % 5 === 0 && !loadedPages.includes(page)) {
      loadMoreData();
      setLoadedPages([...loadedPages, page]);
    }
  };

  const handleClickToJobDescription = (id) => {
    const selectedJob = filteredData.find((item) => item.id === id);
    setSelectedJobId(selectedJob);
    console.log("selectedJobId", selectedJobId);
    navigate(`/job/${filters.country}/${id}`, { state: selectedJob });
  };

  // Управление пагинацией с клавиатуры
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      handlePaginationChange(
        currentPage + (event.key === "ArrowLeft" ? -1 : 1)
      );
    }
  };

  const hasNoData =
    !loadingMore &&
    (!filteredData || filteredData.length === 0 || data.length === 0);

  return (
    <div className="job-list">
      {loadingMore ? (
        <SkeletonForJobList />
      ) : hasNoData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "60px",
          }}
        >
          <img src={frameImage} alt="No jobs found" />
          <p
            style={{
              marginTop: "20px",
              fontSize: "16px",
              color: "#343A40",
            }}
          >
            По вашему запросу ничего не найдено
          </p>
        </div>
      ) : (
        <>
          {limitedData.map((item) => (
            <Item
              key={item.id}
              data={item}
              onClick={() => handleClickToJobDescription(item.id)}
            />
          ))}

          <div>
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={handlePaginationChange}
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "fit-content",
                paddingTop: "40px",
              }}
            />
          </div>
        </>
      )}
    </div>

    /*     <div onKeyDown={handleKeyDown} tabIndex={0}>
      <>
        {loadingMore ? (
          <SkeletonForJobList />
        ) : (
          <>
            {limitedData.map((item) => (
              <Item
                key={item.id}
                data={item}
                onClick={() => handleClickToJobDescription(item.id)}
              />
            ))}

            <div>
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={handlePaginationChange}
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "fit-content",
                  paddingTop: "30px",
                }}
              />
            </div>
          </>
        )}
      </>
    </div> */
  );
};

export default JobList;
