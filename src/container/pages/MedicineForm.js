import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported
import MedicineMap from "./MedicineMap";
import MedicineAgreedMap from "./MedicineAgreedMap";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";

const MedicineForm = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Assume you fetch user's state and city from local storage or context
        const userState = localStorage.getItem("userState");
        const userCity = localStorage.getItem("userCity");
        const response = await axios.get(
          `http://3.39.190.90/api/location/medicine`,
          {
            params: {
              state: userState,
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
      {isLoggedIn && locationData ? (
        <div>
          <h2>현재 위치에 따른 폐의약품 수거함 위치</h2>
          <MedicineAgreedMap locationData={locationData} />
        </div>
      ) : (
        <div>
          <h2>대구광역시 폐의약품 수거함 위치 ＞</h2>
          <MedicineMap />
        </div>
      )}
    </div>
  );
};

export default MedicineForm;
