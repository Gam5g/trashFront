import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import Paging from "../container/pages/Community/Paging";
import "../Button.css";
import "./MapForm.css";

const MapForm = ({
  MapComponent,
  primaryTitle,
  secondaryTitle,
  primaryPath,
  secondaryPath,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 후에 접속하세요.");
      navigate(-1);
    }
  }, [isLoggedIn]);

  const handlePageChange = async (pageNumber) => {
    console.log(pageNumber);
    setActivePage(pageNumber);
  };

  const updateTotalItems = (total) => {
    setTotalItems(total);
  };

  const navigateToSecondary = () => {
    navigate(secondaryPath);
  };

  return (
    <div className="map-form-container" style={{ marginTop: "300px" }}>
      <h1>대구광역시 수거함 위치 ＞</h1>
      <div
        className="location-button-container"
        style={{ marginTop: "40px", marginBottom: "20px" }}
      >
        {primaryPath === "/battery" ? (
          <>
            <button
              className="map-disabled-button"
              onClick={navigateToSecondary}
            >
              {secondaryTitle}
            </button>
            <button className="map-current-button">{primaryTitle}</button>
          </>
        ) : (
          <>
            <button className="map-current-button">{primaryTitle}</button>
            <button
              className="map-disabled-button"
              onClick={navigateToSecondary}
            >
              {secondaryTitle}
            </button>
          </>
        )}
      </div>
      <MapComponent page={activePage} updateTotalItems={updateTotalItems} />
      <Paging
        totalItemsCount={totalItems}
        onPageChange={handlePageChange}
        activePage={activePage}
      />
    </div>
  );
};

export default MapForm;
