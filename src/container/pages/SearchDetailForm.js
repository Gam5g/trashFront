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

    if (location.state && location.state.searchData) {
      setSearchResult(location.state.searchData);
    } else if (query) {
      fetchData();
    }
  }, [query, location.state]);

  const navigateToHome = () => {
    navigate("/");
  };

  const handleEdit = (searchData) => {
    navigate(`/search/edit?query=${encodeURIComponent(query)}`, {
      state: { searchData: searchResult },
    });
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
    </div>
  );
}

export default SearchDetailForm;
