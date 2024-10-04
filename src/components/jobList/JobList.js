import React, { useEffect, useContext } from "react";
import { Pagination } from "@mantine/core";
import SkeletonForJobList from "../skeleton/skeleton";
import Item from "../jobItem/JobItem";
import "./jobList.css";
/* import frameImage from "./Frame.svg"; */
import { JobsContext } from "../app/App";
import { request } from "../services/Superjobservice";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const navigate = useNavigate();

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
  }, [data]);

  const filteredData = data.map((item) => {
    const {
      id,
      title: profession,
      location: { display_name: town, area: locationArea },
      contract_time: type_of_work,
      salary_min: payment_from,
      salary_max: payment_to,
      description,
      redirect_url,
    } = item;

    const country =
      locationArea && locationArea.length > 0 ? locationArea[0] : null;

    return {
      id,
      profession,
      town,
      country,
      type_of_work,
      payment_from,
      payment_to,
      description,
      redirect_url,
    };
  });

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
    navigate(`/job/${id}`, { state: selectedJob });
  };

  // Управление пагинацией с клавиатуры
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      handlePaginationChange(
        currentPage + (event.key === "ArrowLeft" ? -1 : 1)
      );
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
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
                  paddingTop: "40px",
                }}
              />
            </div>
          </>
        )}
      </>
    </div>

    /* <div onKeyDown={handleKeyDown} tabIndex={0}>
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
                  paddingTop: "40px",
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
