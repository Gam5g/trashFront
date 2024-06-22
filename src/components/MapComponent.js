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
  const [isChecked, setIsChecked] = useState(false);
  const [radius, setRadius] = useState(0);
  const latitude = localStorage.getItem("latitude");
  const longitude = localStorage.getItem("longitude");
  const isValidCoordinate = (coord) => {
    const num = parseFloat(coord);
    return !isNaN(num) && isFinite(num);
  };

  const isLocationAvailable =
    isValidCoordinate(latitude) && isValidCoordinate(longitude);

  useEffect(() => {
    const fetchLocationData = async (region) => {
      try {
        setLocationData([]);
        const userCity = localStorage.getItem("userCity") || defaultRegion;
        let response;
        if (isChecked) {
          const accountId = localStorage.getItem("accountId");
          const accessToken = localStorage.getItem("accessToken");
          response = await AuthToken.get(
            `${endpoint}/coordinate?id=${accountId}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&page=${page - 1}&size=10`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else {
          response = await AuthToken.get(
            `${endpoint}?state=대구&city=${region || userCity}&page=${page - 1}&size=10`
          );
        }
        if (response.data.numberOfElements === 0) {
          setLocationData([{ address: "지정된 위치에 수거함이 없습니다" }]);
        } else {
          setLocationData(response.data.content);
          updateTotalItems(response.data.totalElements);
        }
      } catch (error) {
        console.error("Failed to fetch location data", error);
      }
    };

    if (isLoggedIn) {
      fetchLocationData(activeRegion);
    }
  }, [isLoggedIn, activeRegion, page, isChecked, radius, clickedPosition]);

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
        if (position.address === "지정된 위치에 수거함이 없습니다") {
          return;
        }
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

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleRadiusChange = (e) => {
    setRadius(parseInt(e.target.value, 10));
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
      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            disabled={!isLocationAvailable}
          />
          반경으로 검색(회원가입에서 위치동의하지 않았을 경우 사용 불가)
        </label>
      </div>
      {!isChecked &&
        regionButtons.map((region) => (
          <button
            key={region}
            className={`region-button ${activeRegion === region ? "active" : ""}`}
            onClick={() => toggleMarker(region)}
          >
            {region}
          </button>
        ))}
      <div>
        {isChecked && (
          <div className="button-container">
            <input
              type="number"
              value={radius}
              onChange={handleRadiusChange}
              placeholder="radius"
              style={{ width: "45px" }}
            />
            <p>m 반경 근처에 있는 수거함 목록</p>
          </div>
        )}
      </div>
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
                cursor:
                  position.address === "지정된 위치에 수거함이 없습니다"
                    ? "default"
                    : "pointer",
                padding: "10px",
                pointerEvents:
                  position.address === "지정된 위치에 수거함이 없습니다"
                    ? "none"
                    : "auto",
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
