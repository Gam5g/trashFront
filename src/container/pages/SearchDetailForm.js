import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import AuthToken from "./AuthToken";
import "../../style.css";
import Paging from "./Community/Paging";
import "./Solution.css";

const SearchDetailForm = () => {
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState({
    wasteId: "",
    categories: [],
    imageUrl: "",
    accountNickName: "",
    solution: " ",
    name: "",
    state: "",
    tags: [],
  });
  const [wikiResult, setWikiResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const wasteId = searchResult.wasteId;

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
      } finally {
        setIsLoading(false);
      }
    };

    if (location.state && location.state.searchData) {
      setSearchResult(location.state.searchData);
      setIsLoading(false);
    } else if (query) {
      fetchData();
    }
  }, [query, location.state]);

  useEffect(() => {
    const fetchList = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await AuthToken.get(`/solution/${wasteId}/wiki`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setWikiResult(response.data.content);
      } catch (error) {
        console.log(error);
      }
    };
    if (searchResult.wasteId) {
      fetchList();
    }
  }, [searchResult]);

  const navigateToHome = () => {
    navigate("/");
  };

  const handleEdit = () => {
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

  const SolutionMiniList = ({ type, resource }) => {
    const [activePage, setActivePage] = useState(1);
    const [requests, setRequests] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const wasteId = resource;

    const handlePageChange = async (pageNumber) => {
      setActivePage(pageNumber);
    };

    const handleRequestClick = (wikiId) => {
      navigate(`/wiki/detail/${wikiId}`);
    };

    const fetchPageData = async (pageNumber) => {
      try {
        const response = await AuthToken.get(
          `/solution/${wasteId}/wiki?page=${pageNumber - 1}&size=5`,
          {
            headers: {
              Authorization: localStorage.getItem("accessToken"),
            },
          }
        );

        if (response.data && response.data.content) {
          console.log(response.data);
          setRequests(response.data.content);
          setTotalItems(response.data.totalElements);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    useEffect(() => {
      fetchPageData(activePage);
    }, [activePage]);

    return (
      requests &&
      requests.length > 0 && (
        <div className="NotDrag">
          <p
            style={{
              textAlign: "center",
              color: "green",
              fontSize: "25px",
            }}
          >
            수정 히스토리
          </p>
          <div className="request-list" style={{ width: "70%" }}>
            <div className="list" style={{ width: "95%" }}>
              {requests.map((request) => (
                <div
                  key={request.wikiId}
                  className="lists-item"
                  onClick={() => handleRequestClick(request.wikiId)}
                >
                  <div className="lists-item-header">
                    <span>{request.wasteName}</span>
                  </div>
                  <div className="lists-item-footer">
                    <span className="status">
                      {request.wikiState === "ACCEPTED"
                        ? "✔️"
                        : request.wikiState === "PENDING"
                          ? "대기"
                          : "❌"}
                    </span>
                    <span className="date">
                      {new Date(request.createdDate).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Paging
              totalItemsCount={totalItems}
              onPageChange={handlePageChange}
              activePage={activePage}
            />
          </div>
        </div>
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="NotDrag" style={{ marginTop: "250px" }}>
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
            {searchResult.imageUrl && (
              <img
                src={searchResult.imageUrl}
                style={{
                  width: "30%",
                  height: "30%",
                }}
                alt={searchResult.name}
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
          <div>
            <SolutionMiniList
              type={isAdmin ? "admin" : "user"}
              resource={wasteId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDetailForm;
