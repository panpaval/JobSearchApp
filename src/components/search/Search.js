import { useContext } from "react";
import { JobsContext } from "../app/App";
import { Input, Button } from "@mantine/core";
import "./search.css";
import { Search } from "tabler-icons-react";
import { request } from "../services/Superjobservice";

function SearchPanel() {
  const {
    setData,
    keyword,
    setKeyword,
    setCurrentPage,
    setLoadingMore,
    setPageForRequest,
    setFilters,
    initialFilters,
  } = useContext(JobsContext);

  const handleChange = (event) => {
    setKeyword(event.currentTarget.value);
  };

  const handleSearch = async () => {
    console.log("keyword", keyword);
    setFilters(initialFilters);
    setPageForRequest(2);
    setLoadingMore(true);
    let data;
    if (keyword) {
      data = await request({}, keyword);
      setData(data.results);
      console.log("data", data);
      setCurrentPage(1);
    }
    setLoadingMore(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

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
