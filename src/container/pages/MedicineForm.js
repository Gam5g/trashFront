import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MedicineMap from "./MedicineMap";
import MedicineAgreedMap from "./MedicineAgreedMap";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import { useMediaQuery } from "react-responsive";
import "../../Button.css";
import Paging from "./Community/Paging";

const MedicineForm = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [locationData, setLocationData] = useState(null);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const handlePageChange = async (pageNumber) => {
    setActivePage(pageNumber);
  };
  const navigateToBattery = () => {
    navigate("/battery");
  };
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const userCity = localStorage.getItem("userCity");
        const response = await axios.get(
          `http://3.39.190.90/api/location/medicine`,
          {
            params: {
              state: "대구",
              city: userCity,
            },
          }
        );
        setLocationData(response.data);
        console.log("Location data fetched:", response.data);
      } catch (error) {
        console.error("Failed to fetch location data", error);
      }
    };

    if (isLoggedIn) {
      fetchLocationData();
    }
  }, [isLoggedIn]);

  return (
    <div className="NotDrag" style={{ marginTop: "250px" }}>
      <h1>대구광역시 수거함 위치 ＞</h1>
      <div
        className="location-button-container"
        style={{ marginTop: "40px", marginBottom: "20px" }}
      >
        <button className="location-green-button">폐의약품 수거함</button>
        <button className="gray-button" onClick={navigateToBattery}>
          폐건전지/폐형광등 수거함
        </button>
      </div>
      <MedicineMap />
      <Paging
        totalItemsCount={totalItems}
        onPageChange={handlePageChange}
        activePage={activePage}
      />
    </div>
  );
};

export default MedicineForm;
