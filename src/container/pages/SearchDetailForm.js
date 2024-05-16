import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trash } from "./trash";
import Medicine from "./MedicineMap";
import "../../style.css";
import MainForm from "./MainForm";

function SearchDetailForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const navigate = useNavigate();
  const searchResult = Trash.find((item) => item.name === query);

  const navigateToHome = () => {
    navigate("/");
  };
  const handleEdit = () => {
    navigate(`/search/edit?query=${encodeURIComponent(query)}`);
  };
  return (
    <div className="NotDrag">
      {searchResult ? (
        <div>
          <div>
            <h1 style={{ textAlign: "center" }}>{searchResult.name}</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={searchResult.image}
                style={{
                  width: "60%",
                  height: "60%",
                }}
                alt={searchResult.name}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  textAlign: "center",
                  color: "green",
                  fontSize: "25px",
                }}
              >
                재질
              </p>
              {searchResult.quality}
              <p
                style={{
                  textAlign: "center",
                  color: "green",
                  fontSize: "25px",
                }}
              >
                키워드
              </p>
              {searchResult.keywords}
              <p
                style={{
                  textAlign: "center",
                  color: "green",
                  fontSize: "25px",
                }}
              >
                배출 요령
              </p>
              <p>{searchResult.rules}</p>
            </div>
            <div style={{ marginLeft: "350px" }}>
              <button onClick={handleEdit}>수정하기</button>
              <button onClick={navigateToHome} style={{ marginLeft: "10px" }}>
                돌아가기
              </button>
            </div>
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
