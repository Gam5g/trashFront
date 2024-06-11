import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import Paging from "../container/pages/Community/Paging";
import "../Button.css";

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

  const handlePageChange = async (pageNumber) => {
    setActivePage(pageNumber);
  };

  const updateTotalItems = (total) => {
    setTotalItems(total);
  };

  const navigateToSecondary = () => {
    navigate(secondaryPath);
  };

  return (
    <div className="NotDrag" style={{ marginTop: "250px" }}>
      <h1>대구광역시 수거함 위치 ＞</h1>
      <div
        className="location-button-container"
        style={{ marginTop: "40px", marginBottom: "20px" }}
      >
        {primaryPath === "/battery" ? (
          <>
            <button className="gray-button" onClick={navigateToSecondary}>
              {secondaryTitle}
            </button>
            <button className="location-green-button">{primaryTitle}</button>
          </>
        ) : (
          <>
            <button className="location-green-button">{primaryTitle}</button>
            <button className="gray-button" onClick={navigateToSecondary}>
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
