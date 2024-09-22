import { useState, useEffect, useContext } from "react";
import { requestIndustryName } from "../services/Superjobservice";
import { JobsContext } from "../app/App";

export function useFetchIndustries() {
  const { filters } = useContext(JobsContext);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestIndustryName(filters);

        setCategories(response.results);
      } catch (error) {
        console.log(error);
        setCategories(null);
      } finally {
      }
    };

    fetchData();
  }, [filters]); /* 
  console.log("FilterHook filters", filters);
  console.log("categories", categories); */
  return categories || [];
}
