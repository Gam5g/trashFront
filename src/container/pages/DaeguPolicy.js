import React, { useState } from "react";
import "./DaeguPolicy.css";

const DaeguPolicy = () => {
  const [activeRegion, setActiveRegion] = useState("서구");

  const regionInfo = {
    서구: {
      text: "서구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/seogu-image.jpg",
    },
    달서구: {
      text: "달서구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/dalseogu-image.jpg",
    },
    북구: {
      text: "북구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/bukgu-image.jpg",
    },
    남구: {
      text: "남구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/namgu-image.jpg",
    },
    수성구: {
      text: "수성구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/suseonggu-image.jpg",
    },
    달성군: {
      text: "달성군의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/dalseonggun-image.jpg",
    },
    중구: {
      text: "중구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/junggu-image.jpg",
    },
    동구: {
      text: "동구의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/donggu-image.jpg",
    },
    군위군: {
      text: "군위군의 생활쓰레기 배출 및 수거 일시",
      img: "/images/regions/gunwigun-image.jpg",
    },
  };
  const [activeInfo, setActiveInfo] = useState(regionInfo["서구"]);
  const toggleMarker = (subregion) => {
    setActiveRegion(subregion);
    setActiveInfo(regionInfo[subregion]);
  };

  return (
    <div className="NotDrag" style={{ marginTop: "250px" }}>
      <h1> 대구의 분리수거 정책 ＞ </h1>
      <br />
      <h2>대구광역시 쓰레기 봉투 가격(2023.1.1.기준)</h2>
      <table className="price-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>3L</th>
            <th>5L</th>
            <th>10L</th>
            <th>20L</th>
            <th>30L</th>
            <th>50L</th>
            <th>75L</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>대구시 판매가격</td>
            <th>100원</th>
            <th>150원</th>
            <th>290원</th>
            <th>560원</th>
            <th>850원</th>
            <th>1,400원</th>
            <th>2,080원</th>
          </tr>
          <tr>
            <td>군위군 판매가격</td>
            <th>-</th>
            <th>70원</th>
            <th>130원</th>
            <th>240원</th>
            <th>-</th>
            <th>600원</th>
            <th>-</th>
          </tr>
        </tbody>
      </table>
      <br />
      <h2>음식물류폐기물 납부필증 가격(2023.1.1.기준)</h2>
      <table className="price-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>2t</th>
            <th>3t</th>
            <th>5t</th>
            <th>10t</th>
            <th>20t</th>
            <th>60t</th>
            <th>120t</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>대구시 판매가격</td>
            <th>80원</th>
            <th>120원</th>
            <th>200원</th>
            <th>400원</th>
            <th>810원</th>
            <th>2,440원</th>
            <th>4,880원</th>
          </tr>
          <tr>
            <td>군위군 판매가격</td>
            <th>-</th>
            <th>-</th>
            <th>70원</th>
            <th>130원</th>
            <th>240원</th>
            <th>-</th>
            <th>-</th>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <div>
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
        {activeInfo && (
          <div className="region-info">
            <p>{activeInfo.text}</p>
            <img src={activeInfo.img} alt={`${activeRegion} 이미지`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DaeguPolicy;
