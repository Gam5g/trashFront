import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthToken from "../container/pages/AuthToken";
import Paging from "../container/pages/Community/Paging";
import "../container/pages/Solution.css";
import "../container/pages/AdminInfo.css";

const SolutionList = ({ type, mode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(mode);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const handleUserTabChange = (tab) => {
    setSelectedTab(tab);
    navigate(`/${tab}/request/list`);
  };

  const handleAdminTabChange = (tab) => {
    setSelectedTab(tab);
    navigate(`/admin/${tab}/request/list`);
  };

  const handlePageChange = async (pageNumber) => {
    setActivePage(pageNumber);
    await fetchPageData(pageNumber);
  };

  const handleRequestClick = (type, mode, request) => {
    setSelectedRequest(request);
    const wasteId = request.wasteId;
    const wikiId = request.wikiId;
    if (type === "admin") {
      if (mode === "create") {
        navigate(`/admin/${mode}/request/info/${wasteId}`, {
          state: { wasteId },
        });
      } else {
        navigate(`/admin/${mode}/request/info/${wikiId}`, {
          state: { wikiId },
        });
      }
    } else if (type === "user") {
      if (mode === "create") {
        navigate(`/${mode}/request/info/${wasteId}`, { state: { wasteId } });
      } else {
        navigate(`/${mode}/request/info/${wikiId}`, { state: { wikiId } });
      }
    } else if (type === "totalSolution") {
      navigate(`/solution/detail/${wasteId}`, { state: { wasteId } });
    } else if (type === "totalWiki") {
      navigate(`/wiki/detail/${wikiId}`, { state: { wikiId } });
    } else {
      alert("없음");
    }
  };

  const fetchPageData = async (pageNumber) => {
    try {
      let url = "";
      const accountId = localStorage.getItem("accountId");
      if (type === "user") {
        if (mode === "create") {
          url = `/account/${accountId}/contributions/creation?state=pending&page=${pageNumber - 1}&size=10`;
        } else {
          url = `/account/${accountId}/contributions/modification?state=pending&page=${pageNumber - 1}&size=10`;
        }
      } else {
        if (type === "totalSolution" || mode === "create") {
          url = `/solution?page=${pageNumber - 1}&size=10`;
        } else if (type === "totalWiki" || mode === "update") {
          url = `/wiki?page=${pageNumber - 1}&size=10`;
        }
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
      {type === "admin" && <h3 className="admin-info-text">관리자 로그인</h3>}
      {type === "user" && <h1>나의 요청 리스트</h1>}
      {type === "admin" && <h1>요청 리스트</h1>}
      {type === "totalSolution" && <h1>현재 솔루션 반영 상태</h1>}
      {type === "totalWiki" && <h1>현재 위키 반영 상태</h1>}
      <div className="tabs">
        {type === "user" && (
          <div>
            <button
              className={mode === "update" ? "active" : ""}
              onClick={() => handleUserTabChange("update")}
            >
              수정 요청
            </button>
            <button
              className={mode === "create" ? "active" : ""}
              onClick={() => handleUserTabChange("create")}
            >
              생성 요청
            </button>
          </div>
        )}
        {type === "admin" && (
          <div>
            <button
              className={mode === "update" ? "active" : ""}
              onClick={() => handleAdminTabChange("update")}
            >
              수정 요청
            </button>
            <button
              className={mode === "create" ? "active" : ""}
              onClick={() => handleAdminTabChange("create")}
            >
              생성 요청
            </button>
          </div>
        )}
      </div>
      <div className="request-list">
        <div className="list">
          {requests.map((request) => (
            <div
              key={request.wasteId || request.wikiId}
              className="lists-item"
              onClick={() => handleRequestClick(type, mode, request)}
            >
              <div className="lists-item-header">
                <span className="title">{request.wasteName}</span>
              </div>
              <div className="lists-item-footer">
                <span className="status">
                  {mode === "create" ||
                    (type === "totalWiki" && (
                      <>
                        생성 여부:{" "}
                        {request.state === "ACCEPTED"
                          ? "✔️"
                          : request.state === "PENDING"
                            ? "대기"
                            : "❌"}
                      </>
                    ))}
                  {mode === "update" ||
                    (type === "totalSolution" && (
                      <>
                        반영 여부:{" "}
                        {request.state === "ACCEPTED"
                          ? "✔️"
                          : request.state === "PENDING"
                            ? "대기"
                            : "❌"}
                      </>
                    ))}
                  {type === "admin" ||
                    (mode === "update" && (
                      <>
                        반영 여부:{" "}
                        {request.wikiState === "ACCEPTED"
                          ? "✔️"
                          : request.wikiState === "PENDING"
                            ? "대기"
                            : "❌"}
                      </>
                    ))}
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
