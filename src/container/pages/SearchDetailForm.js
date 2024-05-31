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

  const navigateToCommunity = () => {
    navigate(`/community-bunri`);
  };

  const formatRules = (rules) => {
    return rules.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="NotDrag" style={{ marginTop: "40px" }}>
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
                  width: "30%",
                  height: "30%",
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
              <p>{formatRules(searchResult.rules)}</p>
            </div>
            <div className="button-container">
              <button
                className="white-button"
                style={{ marginLeft: "30px" }}
                onClick={handleEdit}
              >
                수정하기
              </button>
              <button
                className="white-button"
                onClick={navigateToHome}
                style={{ marginLeft: "5px" }}
              >
                돌아가기
              </button>
            </div>
            {searchResult.name === "폐의약품" ||
              (searchResult.name === "폐의약품" && (
                <div>
                  <div>
                    <h1>근처에 폐의약품이나 폐건전지 수거함을 찾아보세요</h1>
                  </div>
                  <div>
                    <Medicine />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>
          <img src={"images/sad.jpg"} style={{ width: "500px" }} alt="없음" />
          <h2 style={{ textAlign: "center" }}>
            죄송합니다. 해당 사진에 대한 결과가 없습니다.
          </h2>
          <button
            className="white-button"
            onClick={navigateToCommunity}
            style={{ width: "600px" }}
          >
            분리수거 게시판에 글 쓰러 가기
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchDetailForm;
