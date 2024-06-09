import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Paging from "./Community/Paging";
import "./Community/Paging.css";
import "./RequestList.css";

const RequestModifiedList = () => {
  const [selectedTab, setSelectedTab] = useState("modify");
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();
  const requests = [
    {
      id: 1,
      title: "통조림 캔 by 라이언",
      status: "approved",
      date: "2024년 05월 29일 03:01",
      changes: "3개의 추가, 1개의 삭제",
    },
    {
      id: 2,
      title: "피자박스 by 라이언",
      status: "pending",
      date: "2024년 05월 29일 03:01",
      changes: "3개의 추가, 1개의 삭제",
    },
    {
      id: 3,
      title: "칫솔 by 라이언",
      status: "approved",
      date: "2024년 05월 29일 03:01",
      changes: "3개의 추가, 1개의 삭제",
    },
    {
      id: 4,
      title: "유리병 by 라이언",
      status: "rejected",
      date: "2024년 05월 29일 03:01",
      changes: "3개의 추가, 1개의 삭제",
    },
  ];

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    navigate(`/my-page/request/create-list`);
  };
  const itemsPerPage = 10; // 페이지 당 항목 수
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  return (
    <div>
      <h1>나의 요청 리스트</h1>
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
            <div key={request.id} className="list-item">
              <div className="list-item-header">
                <span className="changes">{request.changes}</span>
                <span className="title">{request.title}</span>
              </div>
              <div className="list-item-footer">
                <span className="status">
                  반영 여부:{" "}
                  {request.status === "approved"
                    ? "✔️"
                    : request.status === "pending"
                      ? "대기"
                      : "❌"}
                </span>
                <span className="date">{request.date}</span>
              </div>
            </div>
          ))}
        </div>
        <Paging
          totalItemsCount={requests.length}
          onPageChange={handlePageChange}
          activePage={activePage}
        />
      </div>
    </div>
  );
};

export default RequestModifiedList;
