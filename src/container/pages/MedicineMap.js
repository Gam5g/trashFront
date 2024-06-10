import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import { useMediaQuery } from "react-responsive";
import AuthToken from "./AuthToken";
import "../../style.css";
import "../../Button.css";
const { kakao } = window;

const MedicineMap = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [map, setMap] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [activeRegion, setActiveRegion] = useState("서구");

  useEffect(() => {
    const fetchLocationData = async (region) => {
      try {
        const userCity = localStorage.getItem("userCity") || "서구";
        const response = await AuthToken.get(`/location/medicine`, {
          state: "대구",
          city: region || userCity,
        });
        setLocationData(response.data);
        console.log("Location data fetched:", response.data);
      } catch (error) {
        console.error("Failed to fetch location data", error);
      }
    };

    if (isLoggedIn) {
      fetchLocationData(activeRegion);
    }
  }, [isLoggedIn, activeRegion]);

  useEffect(() => {
    const container = document.getElementById("map");

    const options = {
      center: new kakao.maps.LatLng(35.8606528, 128.5607254),
      level: 6,
    };
    const mapObj = new kakao.maps.Map(container, options);
    setMap(mapObj);
  }, []);

  useEffect(() => {
    if (map && locationData) {
      locationData.forEach((position) => {
        const markerPosition = new kakao.maps.LatLng(
          position.latitude,
          position.longitude
        );
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: new kakao.maps.MarkerImage(
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
            new kakao.maps.Size(24, 35)
          ),
          title: position.location,
        });

        marker.setMap(map);

        kakao.maps.event.addListener(marker, "click", () => {
          map.setCenter(marker.getPosition());
          const showWindow = new kakao.maps.InfoWindow({
            content: `<div>${position.location}</div>`,
          });
          showWindow.open(map, marker);
        });
      });
    }
  }, [map, locationData]);

  const toggleMarker = (subregion) => {
    setActiveRegion(subregion);
  };

  const handlePositionClick = (position) => {
    map.setLevel(6);
    const center = new kakao.maps.LatLng(position.latitude, position.longitude);
    map.panTo(center);
    setClickedPosition(position);
  };

  return (
    <div className="NotDrag">
      <div
        id="map"
        className="map-container"
        style={
          isMobile
            ? { width: "360px", height: "250px" }
            : { width: "660px", height: "500px" }
        }
      ></div>
      <button
        className={`region-button ${activeRegion === "서구" ? "active" : ""}`}
        onClick={() => toggleMarker("서구")}
      >
        서구
      </button>
      <button
        className={`region-button ${activeRegion === "달서구" ? "active" : ""}`}
        onClick={() => toggleMarker("달서구")}
      >
        달서구
      </button>
      <button
        className={`region-button ${activeRegion === "북구" ? "active" : ""}`}
        onClick={() => toggleMarker("북구")}
      >
        북구
      </button>
      <button
        className={`region-button ${activeRegion === "남구" ? "active" : ""}`}
        onClick={() => toggleMarker("남구")}
      >
        남구
      </button>
      <button
        className={`region-button ${activeRegion === "수성구" ? "active" : ""}`}
        onClick={() => toggleMarker("수성구")}
      >
        수성구
      </button>
      <button
        className={`region-button ${activeRegion === "달성군" ? "active" : ""}`}
        onClick={() => toggleMarker("달성군")}
      >
        달성군
      </button>
      <button
        className={`region-button ${activeRegion === "중구" ? "active" : ""}`}
        onClick={() => toggleMarker("중구")}
      >
        중구
      </button>
      <button
        className={`region-button ${activeRegion === "동구" ? "active" : ""}`}
        onClick={() => toggleMarker("동구")}
      >
        동구
      </button>
      <button
        className={`region-button ${activeRegion === "군위군" ? "active" : ""}`}
        onClick={() => toggleMarker("군위군")}
      >
        군위군
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {locationData &&
          locationData.map((position) => (
            <div
              key={position.location}
              className={`position-item ${
                clickedPosition &&
                clickedPosition.location === position.location
                  ? "active"
                  : ""
              }`}
              style={{
                border: "0.1px solid #c8c8c8",
                cursor: "pointer",
              }}
              onClick={() => handlePositionClick(position)}
            >
              <p>{position.location}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MedicineMap;
