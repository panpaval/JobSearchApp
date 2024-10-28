import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Item from "../jobItem/JobItem";
import "./jobdescription.css";
import { JobsContext } from "../app/App";
import { getJobById } from "../services/Superjobservice";
import { Button } from "@mantine/core";
import SkeletonForJobList from "../skeleton/skeleton";
import frameImage from "./Frame.svg";

const JobDescription = () => {
  const { id, country } = useParams();

  const navigate = useNavigate();
  const { setIsJobDescriptionPage } = useContext(JobsContext);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsJobDescriptionPage(true);
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(id, { country });
        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Ошибка на сервере");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
    return () => {
      setIsJobDescriptionPage(false);
    };
  }, [id, setIsJobDescriptionPage]);

  const handleBackToSearch = () => {
    navigate("/");
  };

  /*  if (isLoading)
    return (
      <div>
        <SkeletonForJobList />
      </div>
    ); */
  if (error) return <div>{error}</div>;

  if (!job && !isLoading)
    return (
      <div className="description-image">
        <img src={frameImage} alt="Job not found or wrong ID" />

        <p className="text-spacing">Такой вакансии нет</p>
      </div>
    );

  return (
    <>
      {isLoading ? (
        <SkeletonForJobList />
      ) : (
        <>
          <Item data={job} isJobDescription={true} />
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  left: "45%",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                }}
              >
                Нажмите для перехода
              </div>
            )}
            <div
              style={{
                padding: "24px",
                marginTop: "16px",
                backgroundColor: isHovered
                  ? "rgba(255, 255, 255, 0.25)"
                  : "white",
                borderRadius: "10px",
              }}
              onClick={() => window.open(job.redirect_url, "_blank")}
            >
              <h2>Подробное описание</h2>

              {job.description}
            </div>
          </div>
          <Button
            mt={16}
            fullWidth
            type="submit"
            variant="filled"
            onClick={handleBackToSearch}
          >
            Назад к списку
          </Button>{" "}
        </>
      )}
    </>
  );
};

export default JobDescription;
