import { useContext, useState, useEffect } from "react";
import { JobsContext } from "../app/App";
import { Button, Select, NumberInput, Box } from "@mantine/core";
import "./filter.css";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import { useFetchIndustries } from "./filterHook";
import { request } from "../services/Superjobservice";

function Filter() {
  const {
    setData,
    setLoadedPages,
    setKeyword,
    setCurrentPage,
    setLoadingMore,
    keyword,
    setPageForRequest,
    initialFilters,
    filters,
    setFilters,
    firstRequest,
    setSelectedJobId,
  } = useContext(JobsContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const industriesData = useFetchIndustries();

  const countryOptions = [
    { value: "gb", label: "United Kingdom" },
    { value: "us", label: "United States" },
    { value: "at", label: "Austria" },
    { value: "au", label: "Australia" },
    { value: "br", label: "Brazil" },
    { value: "be", label: "Belgium" },
    { value: "ca", label: "Canada" },
    { value: "ch", label: "Switzerland" },
    { value: "de", label: "Germany" },
    { value: "es", label: "Spain" },
    { value: "fr", label: "France" },
    { value: "in", label: "India" },
    { value: "it", label: "Italy" },
    { value: "mx", label: "Mexico" },
    { value: "nl", label: "Netherlands" },
    { value: "nz", label: "New Zealand" },
    { value: "pl", label: "Poland" },
    { value: "sg", label: "Singapore" },
    { value: "za", label: "South Africa" },
  ];

  const options = industriesData?.map((item) => ({
    value: item.tag,
    label: item.label,
  }));

  const handleSubmit = async () => {
    setPageForRequest(2);

    let data;

    if (filters.industry) {
      setKeyword("");
      setCurrentPage(1);
    }

    if (
      filters.industry ||
      filters.country ||
      filters.salaryMin ||
      filters.salaryMax > 0
    ) {
      setLoadingMore(true);
      data = await request(filters, keyword);

      setData(data.results);
      console.log("data", data.results);
      setLoadedPages([]);
      setLoadingMore(false);
      setCurrentPage(1);
    }
    console.log("CATEGORY", filters.industry);
  };

  const handleResetFilters = () => {
    setData(firstRequest);
    setFilters(initialFilters);
    setLoadedPages([]);
    setKeyword("");
    setCurrentPage(1);
    setLoadingMore(false);
    setPageForRequest(1);
    setSelectedJobId(null);
  };

  const handleFilterChange = (field, value) => {
    if (value < 0) {
      value = 0;
    }

    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  return (
    <div
      className={`filter-container ${
        isMobile && isCollapsed ? "collapsed" : ""
      }`}
    >
      <div className="filter-heading">
        <h2 className="filter-title">Фильтры</h2>
        {isMobile && (
          <Button
            className="filter-collapse-button"
            variant="subtle"
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronDown size={30} /> : <ChevronUp size={30} />}
          </Button>
        )}
        <Button
          className="filter-reset-button"
          variant="link"
          onClick={handleResetFilters}
        >
          Сбросить всё
        </Button>
      </div>
      {!isCollapsed && (
        <Box onSubmit={handleSubmit}>
          <h2 className="filter-label">Отрасль</h2>
          <Select
            rightSection={
              <ChevronDown color={"#ACADB9"} size={30} strokeWidth={1.5} />
            }
            styles={{ rightSection: { pointerEvents: "none" } }}
            size="md"
            transitionProps={{
              transition: "pop-top-left",
              duration: 200,
              timingFunction: "ease",
            }}
            data={options}
            placeholder="Выберите отрасль"
            value={filters.industry}
            onChange={(value) => handleFilterChange("industry", value)}
          />

          <h2 className="filter-label">Страна</h2>
          <Select
            rightSection={
              <ChevronDown color={"#ACADB9"} size={30} strokeWidth={1.5} />
            }
            styles={{ rightSection: { pointerEvents: "none" } }}
            size="md"
            transitionProps={{
              transition: "pop-top-left",
              duration: 200,
              timingFunction: "ease",
            }}
            data={countryOptions}
            placeholder="Выберите страну"
            value={filters.country}
            onChange={(value) => handleFilterChange("country", value)}
          />
          <h2 className="filter-salary">Оклад</h2>
          <NumberInput
            placeholder={"От"}
            className="input-style"
            min={0}
            step={5000}
            size="md"
            rightSection={
              <div className="rightSection">
                <div
                  onClick={() =>
                    handleFilterChange(
                      "salaryMin",
                      Number(filters.salaryMin) + 5000
                    )
                  }
                >
                  <ChevronUp size={15} color={"#ACADB9"} display={"block"} />
                </div>
                <div
                  onClick={() =>
                    handleFilterChange(
                      "salaryMin",
                      Number(filters.salaryMin) - 5000
                    )
                  }
                >
                  <ChevronDown size={15} color={"#ACADB9"} display={"block"} />
                </div>
              </div>
            }
            defaultChecked={33333}
            value={filters.salaryMin}
            onChange={(value) => handleFilterChange("salaryMin", value)}
          />
          <NumberInput
            size="md"
            placeholder="До"
            className="input-style"
            min={0}
            step={5000}
            rightSection={
              <div className="rightSection">
                <div
                  onClick={() =>
                    handleFilterChange(
                      "salaryMax",
                      Number(filters.salaryMax) + 5000
                    )
                  }
                >
                  <ChevronUp size={15} color={"#ACADB9"} display={"block"} />
                </div>
                <div
                  onClick={() =>
                    handleFilterChange(
                      "salaryMax",
                      Number(filters.salaryMax) - 5000
                    )
                  }
                >
                  <ChevronDown size={15} color={"#ACADB9"} display={"block"} />
                </div>
              </div>
            }
            value={filters.salaryMax}
            onChange={(value) => handleFilterChange("salaryMax", value)}
          />
          <Button
            onClick={handleSubmit}
            className="filter-submit-button"
            type="submit"
            variant="filled"
          >
            Применить
          </Button>
        </Box>
      )}
    </div>

    /* 
    <div className="filter-container">
      <div className="filter-heading">
        <h2 className="filter-title">Фильтры</h2>
        <Button
          className="filter-reset-button"
          variant="link"
          onClick={handleResetFilters}
        >
          Сбросить всё
        </Button>
      </div> */

    /* </div> */
  );
}

export default Filter;

/*   const handleSubmit = async () => {
    setPageForRequest(2);

    let data;
    const params = {
      filters: {
        category: filters.industry,
        country: filters.country,
        salary: {
          min: filters.salaryMin,
          max: filters.salaryMax,
        },
      },
    };

    if (params.filters.category || params.filters.country !== "us") {
      setKeyword("");
      setCurrentPage(1);
    }

    setParamsForJLRequest(params);
    console.log("paramsJLRequest", params);

    if (
      params.filters.category ||
      params.filters.country !== "us" ||
      params.filters.salary.min ||
      params.filters.salary.max > 0
    ) {
      setLoadingMore(true);
      data = await request(params, keyword);
      console.log("params", params);
      setData(data.results);
      setLoadedPages([]);
      setLoadingMore(false);
    }
  }; */
