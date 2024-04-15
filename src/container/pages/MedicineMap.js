import React, { useState, useEffect } from "react";
import "../../style.css";
import "../../Button.css";

const { kakao } = window;

const MedicineMap = () => {
  const initialPositions = [
    {
      title: "내당1동행정복지센터",
      subregion: "서구",
      location: "대구 서구 서대구로4길 35",
      mapy: 35.8606528,
      mapx: 128.5607254,
    },
    {
      title: "내당2.3동행정복지센터",
      subregion: "서구",
      location: "대구 서구 큰장로15길 11-1",
      mapy: 35.86727528,
      mapx: 128.5745324,
    },
    {
      title: "내당4동행정복지센터",
      subregion: "서구",
      location: "대구 서구 서대구로3길 46",
      mapy: 35.85902046,
      mapx: 128.5518433,
    },
    {
      title: "성당동행정복지센터",
      subregion: "달서구",
      location: "대구 달서구 야외음악당로 38",
      mapy: 35.84061406,
      mapx: 128.553148605562,
    },
    {
      title: "두류1.2동행정복지센터",
      subregion: "달서구",
      location: "대구 달서구 두류길 141-8",
      mapy: 35.8577731987934,
      mapx: 128.567278500004,
    },
    {
      title: "두류3동행정복지센터",
      subregion: "달서구",
      location: "대구 달서구 야외음악당로39길 24",
      mapy: 35.8537053598211,
      mapx: 128.55547533284,
    },
    {
      title: "대구광역시북구청",
      subregion: "북구",
      location: "대구 북구 옥산로 65",
      mapy: 35.8856842974977,
      mapx: 128.58278016173,
    },
    {
      title: "고성동 행정복지센터",
      subregion: "북구",
      location: "대구 북구 고성로31길 21",
      mapy: 35.881845842692,
      mapx: 128.583507567164,
    },
    {
      title: "칠성동 행정복지센터",
      subregion: "북구",
      location: "대구 북구 칠성로19길 4",
      mapy: 35.8792240825644,
      mapx: 128.600019842249,
    },
    {
      title: "대구광역시남구보건소",
      subregion: "남구",
      location: "대구 남구 영선길 34",
      mapy: 35.85389994,
      mapx: 128.591523659931,
    },
  ];
  const [map, setMap] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [positions, setPositions] = useState(initialPositions);
  const [activeRegion, setActiveRegion] = useState("서구");

  useEffect(() => {
    const container = document.getElementById("map");

    const options = {
      center: new kakao.maps.LatLng(35.8606528, 128.5607254),
      level: 6,
    };
    const mapObj = new kakao.maps.Map(container, options);
    setMap(mapObj);

    initialPositions.forEach((position) => {
      const markerPosition = new kakao.maps.LatLng(
        position.mapy,
        position.mapx
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: new kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new kakao.maps.Size(24, 35)
        ),
        title: position.title,
      });

      marker.setMap(mapObj);

      kakao.maps.event.addListener(marker, "click", () => {
        mapObj.setCenter(marker.getPosition());
        const showWindow = new kakao.maps.InfoWindow({
          content: `<div>${position.title}`,
        });
        showWindow.open(mapObj, marker);
      });
    });
    toggleMarker("서구");
  }, []);

  const toggleMarker = (subregion) => {
    const filteredPositions = initialPositions.filter(
      (position) => position.subregion === subregion
    );
    setPositions(filteredPositions);
    if (map) {
      map.setLevel(6);
    }
    if (filteredPositions.length > 0) {
      const center = new kakao.maps.LatLng(
        filteredPositions[0].mapy,
        filteredPositions[0].mapx
      );
      if (map) {
        map.panTo(center);
      }
      setClickedPosition(filteredPositions[0]);
    }
    setActiveRegion(subregion);
  };

  const handlePositionClick = (position) => {
    map.setLevel(6);
    const center = new kakao.maps.LatLng(position.mapy, position.mapx);
    map.panTo(center);
    setClickedPosition(position);
  };

  return (
    <div className="NotDrag">
      <div id="map" style={{ width: "660px", height: "500px" }}></div>
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
        {positions.map((position) => (
          <div
            key={position.title}
            className={`position-item ${
              clickedPosition && clickedPosition.title === position.title
                ? "active"
                : ""
            }`}
            style={{
              border: "0.1px solid #c8c8c8",
              cursor: "pointer",
            }}
            onClick={() => handlePositionClick(position)}
          >
            <p>{position.title}</p>
            <p>{position.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineMap;
