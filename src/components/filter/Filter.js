import { useContext, useState, useEffect } from "react";
import { JobsContext } from "../app/App";
import { Button, Select, NumberInput, Box, Text } from "@mantine/core";
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
    resetForIndustry,
    setResetForIndustry,
    defaultFilters,
    setFilters,
    firstRequest,
    setSelectedJobId,
    filters,
  } = useContext(JobsContext);

  const [localFilters, setLocalFilters] = useState(filters);

  const [salaryError, setSalaryError] =
    useState(""); /* добавлено для обработки неправильной зп в фильтрах */
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

  useEffect(() => {
    if (resetForIndustry) {
      setLocalFilters((prev) => ({
        ...prev,
        industry: "",
      }));
      // Сбрасываем триггер
      setResetForIndustry(false);
    }
  }, [resetForIndustry, setResetForIndustry]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const industriesData = useFetchIndustries(localFilters);

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

  // Функция валидации зарплаты /* добавлено для обработки неправильной зп в фильтрах */
  const validateSalary = (min, max) => {
    if (min > 1000000 || max > 1000000) {
      setSalaryError("зарплата не может превышать 1000000");
      return false;
    }
    if ((min && max && Number(min) > Number(max)) || max === 0) {
      setSalaryError(
        "Максимальная зарплата должна быть больше минимальной, увеличьте"
      );
      return false;
    }
    setSalaryError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSalary(localFilters.salaryMin, localFilters.salaryMax)) {
      return;
    }

    setPageForRequest(2);

    let data;

    // Определяем, какой тип запроса будем делать
    const shouldClearKeyword = localFilters.industry;

    if (shouldClearKeyword) {
      setKeyword("");
    }

    if (
      localFilters.industry ||
      localFilters.country ||
      localFilters.salaryMin ||
      localFilters.salaryMax > 0
    ) {
      setLoadingMore(true);
      try {
        // Передаем keyword как пустую строку, если есть industry
        const searchKeyword = shouldClearKeyword ? "" : keyword;
        data = await request(localFilters, searchKeyword);
        setData(data.results);
        setFilters(localFilters);
        setLoadedPages([]);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  /*  const handleSubmit = async () => {
   
    if (!validateSalary(localFilters.salaryMin, localFilters.salaryMax)) {
      return;
    }

    setPageForRequest(2);

    let data;

    if (localFilters.industry) {
      setKeyword("");
      setCurrentPage(1);
    }

    if (
      localFilters.industry ||
      localFilters.country ||
      localFilters.salaryMin ||
      localFilters.salaryMax > 0
    ) {
      setLoadingMore(true);
      try {
        data = await request(localFilters, keyword);
        setData(data.results);
        setFilters(localFilters);
        setLoadedPages([]);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  }; */

  const handleResetFilters = () => {
    setData(firstRequest);
    setFilters(defaultFilters);
    setLocalFilters(defaultFilters);
    setLoadedPages([]);
    setKeyword("");
    setCurrentPage(1);
    setLoadingMore(false);
    setPageForRequest(1);
    setSelectedJobId(null);
  };

  const handleFilterChange = (field, value) => {
    /* добавлено для обработки неправильной зп в фильтрах */
    if (value < 0) {
      value = 0;
    }

    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);

    if (field === "salaryMin" || field === "salaryMax") {
      validateSalary(newFilters.salaryMin, newFilters.salaryMax);
    }
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
            value={localFilters.country}
            onChange={(value) => handleFilterChange("country", value)}
          />

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
            value={localFilters.industry}
            onChange={(value) => handleFilterChange("industry", value)}
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
                      Number(localFilters.salaryMin) + 5000
                    )
                  }
                >
                  <ChevronUp size={15} color={"#ACADB9"} display={"block"} />
                </div>
                <div
                  onClick={() =>
                    handleFilterChange(
                      "salaryMin",
                      Number(localFilters.salaryMin) - 5000
                    )
                  }
                >
                  <ChevronDown size={15} color={"#ACADB9"} display={"block"} />
                </div>
              </div>
            }
            defaultChecked={33333}
            value={localFilters.salaryMin}
            onChange={(value) =>
              handleFilterChange("salaryMin", value)
            } /* добавлено для обработки неправильной зп в фильтрах */
            /* error={salaryError} */
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
                      Number(localFilters.salaryMax) + 5000
                    )
                  }
                >
                  <ChevronUp size={15} color={"#ACADB9"} display={"block"} />
                </div>
                <div
                  onClick={() =>
                    handleFilterChange(
                      "salaryMax",
                      Number(localFilters.salaryMax) - 5000
                    )
                  }
                >
                  <ChevronDown size={15} color={"#ACADB9"} display={"block"} />
                </div>
              </div>
            }
            value={localFilters.salaryMax}
            onChange={(value) =>
              handleFilterChange("salaryMax", value)
            } /* добавлено для обработки неправильной зп в фильтрах */
            /* error={salaryError} */
          />
          {salaryError && <Text color="red">{salaryError}</Text>}
          {!salaryError && (
            <Button
              onClick={handleSubmit}
              className="filter-submit-button"
              type="submit"
              variant="filled"
            >
              Применить
            </Button>
          )}
        </Box>
      )}
    </div>
  );
}

export default Filter;
