import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import { useMediaQuery } from "react-responsive";
import AuthToken from "../container/pages/AuthToken";
import "../style.css";
import "../Button.css";
const { kakao } = window;

const MapComponent = ({
  endpoint,
  page,
  updateTotalItems,
  defaultRegion,
  regionButtons,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [map, setMap] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [activeRegion, setActiveRegion] = useState(defaultRegion);

  useEffect(() => {
    const fetchLocationData = async (region) => {
      try {
        setLocationData([]);
        const userCity = localStorage.getItem("userCity") || defaultRegion;
        const response = await AuthToken.get(
          `${endpoint}?state=대구&city=${region || userCity}&page=${page - 1}&size=10`
        );
        setLocationData(response.data.content);
        updateTotalItems(response.data.totalElements);
      } catch (error) {
        console.error("Failed to fetch location data", error);
      }
    };

    if (isLoggedIn) {
      fetchLocationData(activeRegion);
    }
  }, [isLoggedIn, activeRegion, page]);

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
    if (map && locationData.length > 0) {
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
          title: position.address,
        });

        marker.setMap(map);

        kakao.maps.event.addListener(marker, "click", () => {
          map.setCenter(marker.getPosition());
          const showWindow = new kakao.maps.InfoWindow({
            content: `<div>${position.address}</div>`,
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
      {regionButtons.map((region) => (
        <button
          key={region}
          className={`region-button ${activeRegion === region ? "active" : ""}`}
          onClick={() => toggleMarker(region)}
        >
          {region}
        </button>
      ))}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {locationData &&
          locationData.map((position) => (
            <div
              key={position.address}
              className={`position-item ${
                clickedPosition && clickedPosition.address === position.address
                  ? "active"
                  : ""
              }`}
              style={{
                border: "0.1px solid #c8c8c8",
                cursor: "pointer",
              }}
              onClick={() => handlePositionClick(position)}
            >
              <p>{position.address}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MapComponent;
