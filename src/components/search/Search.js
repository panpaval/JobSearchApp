import { useContext, useState, useEffect } from "react";
import { JobsContext } from "../app/App";
import { Input, Button } from "@mantine/core";
import "./search.css";
import { Search } from "tabler-icons-react";
import { request } from "../services/Superjobservice";

function SearchPanel() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  const {
    filters,
    setData,
    keyword,
    setKeyword,
    setCurrentPage,
    setLoadingMore,
    setPageForRequest,
    setFilters,
    setResetForIndustry,
    isMobileSearchVisible, // для мобильного поиска
  } = useContext(JobsContext);

  const handleChange = (event) => {
    setKeyword(event.currentTarget.value);
  };

  const handleSearch = async () => {
    setResetForIndustry(true);

    setPageForRequest(2);
    setLoadingMore(true);
    let data;

    const newFilters = {
      ...filters,
      industry: "", // затираем industry в Filter
    };

    if (filters.industry) {
      setFilters(newFilters);
    }

    if (keyword) {
      // Используем уже созданные newFilters
      data = await request(newFilters, keyword);
      setData(data.results);

      setCurrentPage(1);
    }
    setLoadingMore(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile && !isMobileSearchVisible) {
    return null;
  }

  return (
    <Input.Wrapper className="inputWrapper">
      <Input
        value={keyword}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        size="md"
        radius="md"
        icon={<Search size={18.57} strokeWidth={2} />}
        placeholder="Введите название вакансии"
        rightSection={
          <Button
            onClick={handleSearch}
            styles={(theme) => ({
              root: {
                backgroundColor: "#5E96FC",
                marginLeft: -60,
                width: 83,
                height: 32,
                fontSize: 14,
              },
            })}
            radius="md"
          >
            Поиск
          </Button>
        }
      />
    </Input.Wrapper>
  );
}

export default SearchPanel;
