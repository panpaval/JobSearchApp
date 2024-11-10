import { useState, useEffect } from "react";
import { requestLocations } from "../services/Superjobservice";

export function useFetchLocations(filters) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestLocations(filters);

        setLocations(response);
      } catch (error) {
        console.log(error);
        setLocations(null);
      } finally {
      }
    };

    fetchData();
  }, [filters]);
  return locations || [];
}
