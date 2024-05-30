import React from "react";
import { useLocation } from "react-router-dom";
import { Trash } from "./trash";
import Medicine from "./MedicineMap";
import "../../style.css";
import MainForm from "./MainForm";

function SearchDetailForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  const searchResult = Trash.find((item) => item.name === query);

  return (
    <div className="NotDrag">
      {searchResult ? (
        <div>
          <div>
            <h1 style={{ textAlign: "center" }}>{searchResult.name}</h1>
            <img src={searchResult.image} alt={searchResult.name} />
            <p>큰 분류: {searchResult.big}</p>
            <p>작은 분류: {searchResult.small}</p>
            <p
              style={{ textAlign: "center", color: "green", fontSize: "30px" }}
            >
              배출 요령
            </p>
            <p>{searchResult.rules}</p>
            {searchResult.name === "폐의약품" && (
              <div>
                <div>
                  <h1>근처에 폐의약품 수거함을 찾아보세요</h1>
                </div>
                <div>
                  <Medicine />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <img src={"images/sad.jpg"} style={{ width: "500px" }} alt="없음" />
          <h2 style={{ textAlign: "center" }}>검색 결과가 없습니다.</h2>
        </div>
      )}
      <MainForm />
    </div>
  );
}

export default SearchDetailForm;
