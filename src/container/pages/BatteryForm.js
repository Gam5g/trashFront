import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import BatteryMap from "./BatteryMap";
import "../../Button.css";

const BatteryForm = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [locationData, setLocationData] = useState(null);
  const navigate = useNavigate();

  const navigateToMedicine = () => {
    navigate("/medicine");
  };
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const userCity = localStorage.getItem("userCity");
        const response = await axios.get(
          `http://3.39.190.90/api/location/lampAndBattery`,
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
    <div>
      <h1>대구광역시 수거함 위치 ＞</h1>
      <div
        className="location-button-container"
        style={{ marginTop: "40px", marginBottom: "20px" }}
      >
        <button className="gray-button" onClick={navigateToMedicine}>
          폐의약품 수거함
        </button>
        <button className="location-green-button">
          폐건전지/폐형광등 수거함
        </button>
      </div>
      <BatteryMap />
    </div>
  );
};

export default BatteryForm;
