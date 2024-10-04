import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SolutionDetail from "../../components/SolutionDetail";
import "./AdminInfo.css";

const AdminCreateRequestInfo = () => {
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);
  return (
    <div style={{ marginTop: "400px" }}>
      <p className="admin-info-text">관리자 로그인</p>
      <h1 className="admin-text">생성 요청 받은 정보 ＞</h1>
      <SolutionDetail type="admin" />
    </div>
  );
};

export default AdminCreateRequestInfo;
