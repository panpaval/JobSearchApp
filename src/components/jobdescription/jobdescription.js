import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Item from "../jobItem/JobItem";
import "./jobdescription.css";
import { JobsContext } from "../app/App";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

const JobDescription = () => {
  const { state } = useLocation();
  const { setIsJobDescriptionPage } = useContext(JobsContext);
  const [isHovered, setIsHovered] = useState(false); /* 
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); */
  const navigate = useNavigate();

  useEffect(() => {
    setIsJobDescriptionPage(true);
    return () => {
      setIsJobDescriptionPage(false);
    };
  }, [setIsJobDescriptionPage]);

  console.log("job", state);

  /*  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY })
  }; */

  const handleBackToSearch = () => {
    navigate("/");
  };

  return (
    <>
      <Item data={state} isJobDescription={true} />
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
            backgroundColor: isHovered ? "rgba(255, 255, 255, 0.25)" : "white",
            borderRadius: "10px",
          }}
          onClick={() => window.open(state.redirect_url, "_blank")}
        >
          <h2>Подробное описание</h2>

          {state.description}
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
      </Button>
    </>
  );
};

/* return (
  <>
  <Item data={state} onClick={handleBackToSearch} isJobDescription={true}/>
  <div
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onMouseMove={handleMouseMove}
  >
    {isHovered && (
      <div style={{
        position: 'absolute',
        top: cursorPosition.y,
        left: cursorPosition.x + 20,
        backgroundColor: 'rgba(255, 255, 255, 1)'
      }}>
        Нажмите для перехода
      </div>  
    )}
    <div 
      style={{padding: '24px', marginTop: '16px', backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.25)' : 'white', borderRadius: '10px'}}
      onClick={() => window.open(state.redirect_url, '_blank')}  
    >

      <h2>Подробное описание</h2>

      {state.description}

    </div>

  </div>
  </>
);
 */

export default JobDescription;
