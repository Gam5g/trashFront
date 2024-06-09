import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Medicine from "./MedicineMap";
import AuthToken from "./AuthToken";
import "../../style.css";

function SearchDetailForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState({
    categories: [],
    imageUrl: "",
    nickName: "",
    solution: " ",
    solutionName: "",
    state: "",
    tags: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await AuthToken.get(
          `/solution/keyword?keyword=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSearchResult(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  const navigateToHome = () => {
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/search/edit?query=${encodeURIComponent(query)}`);
  };

  const navigateToCommunity = () => {
    navigate(`/community-bunri`);
  };

  const navigateToSolution = () => {
    navigate(`/solution/create`);
  };

  const formatRules = (rules) => {
    if (!rules) return null;
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
            <h1 style={{ textAlign: "center" }}>{searchResult.solutionName}</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {searchResult.imageUrl && (
                <img
                  src={searchResult.imageUrl}
                  style={{
                    width: "30%",
                    height: "30%",
                  }}
                  alt={searchResult.solutionName}
                />
              )}
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
              {searchResult.categories.join(", ")}
              <p
                style={{
                  textAlign: "center",
                  color: "green",
                  fontSize: "25px",
                }}
              >
                키워드
              </p>
              {searchResult.tags.join(", ")}
              <p
                style={{
                  textAlign: "center",
                  color: "green",
                  fontSize: "25px",
                }}
              >
                배출 요령
              </p>
              <p>{formatRules(searchResult.solution)}</p>
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
            {searchResult.solutionName === "폐의약품" && (
              <div>
                <div>
                  <h1>근처에 폐의약품이나 폐건전지 수거함을 찾아보세요</h1>
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
          <button
            className="white-button"
            onClick={navigateToSolution}
            style={{ width: "600px" }}
          >
            새로운 솔루션 작성하기
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchDetailForm;
