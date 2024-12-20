import { useState, useEffect } from "react";
import { requestIndustryName } from "../services/services";

export function useFetchIndustries(filters) {
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
  }, [filters]);
  return categories || [];
}
