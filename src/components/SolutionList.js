import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthToken from "../container/pages/AuthToken";
import Paging from "../container/pages/Community/Paging";
import "../container/pages/Solution.css";

const SolutionList = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("create");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const handleTabChange = (tab) => {
    navigate(`/my-page/request/modified-list`);
    setSelectedTab(tab);
  };

  const handlePageChange = async (pageNumber) => {
    setActivePage(pageNumber);
    await fetchPageData(pageNumber);
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    const wasteId = request.wastId;
    console.log(request);
    navigate(`/my-page/request/${wasteId}`); //wastId임
  };

  const fetchPageData = async (pageNumber) => {
    try {
      let url = "";
      if (type === "user") {
        url =
          "/account/${accountId}/contributions/creation?page=${pageNumber - 1}&size=${itemsPerPage}";
      } else if (type === "admin") {
        url = `/solution?page=${pageNumber - 1}&size=${itemsPerPage}`;
      }
      const response = await AuthToken.get(url, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      setRequests(response.data.content);
      setTotalItems(response.data.totalElements);
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchPageData(activePage);
  }, [activePage]);

  const marginTopValues = [
    { condition: 10, value: "300px" },
    { condition: 9, value: "280px" },
    { condition: 8, value: "260px" },
    { condition: 7, value: "240px" },
    { condition: 6, value: "220px" },
    { condition: 5, value: "200px" },
    { condition: 4, value: "180px" },
    { condition: 3, value: "160px" },
    { condition: 2, value: "140px" },
    { condition: 1, value: "120px" },
  ];

  const marginTopValue =
    marginTopValues.find((mtv) => requests.length >= mtv.condition)?.value ||
    "0px";

  return (
    <div className="NotDrag" style={{ marginTop: marginTopValue }}>
      {type === "create" && <h1>나의 요청 리스트</h1>}
      <div className="tabs">
        <button
          className={selectedTab === "modify" ? "active" : ""}
          onClick={() => handleTabChange("modify")}
        >
          수정 요청
        </button>
        <button
          className={selectedTab === "create" ? "active" : ""}
          onClick={() => handleTabChange("create")}
        >
          생성 요청
        </button>
      </div>
      <div className="request-list">
        <div className="list">
          {requests.map((request) => (
            <div
              key={request.wastId}
              className="lists-item"
              onClick={() => handleRequestClick(request)}
            >
              <div className="lists-item-header">
                <span className="title">{request.name}</span>
              </div>
              <div className="lists-item-footer">
                <span className="status">
                  생성 여부:{" "}
                  {request.contributedCreationState === "ACCEPTED"
                    ? "✔️"
                    : request.contributedCreationState === "PENDING"
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
  );
};

export default SolutionList;
