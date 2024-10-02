import React, { useContext, useState } from "react";
import { JobsContext } from "../app/App";
import Item from "../jobItem/JobItem";
import { Pagination } from "@mantine/core";
import "./favorites.css";
import frameImage from "./Frame.svg";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FavoritesList = () => {
  const { favorites, setActiveLink } = useContext(JobsContext);
  /* console.log('favorites', favorites) */
  const itemsPerPage = 4; // Количество элементов на странице
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(favorites.length / itemsPerPage);

  // Получаем элементы для текущей страницы
  const currentItems = favorites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClick = (link) => {
    setActiveLink(link);
  };

  const handleItemClick = (job) => {
    navigate(`/job/${job.id}`, { state: job });
  };
  return (
    <div>
      {favorites.length > 0 ? (
        <>
          <ul style={{ paddingLeft: 0 }}>
            {currentItems.map((job) => (
              <div key={job.id} className="item favorites-item">
                <Item data={job} onClick={() => handleItemClick(job)} />
              </div>
            ))}
          </ul>
          <Pagination
            page={currentPage}
            onChange={handlePageChange}
            total={totalPages}
            style={{
              justifyContent: "center",
            }}
          />
        </>
      ) : (
        <>
          <div className="centered-container">
            <img
              src={frameImage}
              alt="У вас пока нет избранных вакансий"
              className="image-centered"
            />
            <p className="text-spacing">Упс, здесь ещё ничего нет.</p>
            <Link to="/" onClick={() => handleClick("search")}>
              <Button variant="light">Поиск вакансий</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesList;
