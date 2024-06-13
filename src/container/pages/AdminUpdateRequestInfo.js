import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompareForm from "../../components/CompareForm";

const AdminUpdateRequestInfo = () => {
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);
  return (
    <div style={{ marginTop: "300px" }}>
      <p>관리자 로그인</p>
      <h1>수정 요청 받은 정보 ＞</h1>
      <CompareForm type="admin" />
    </div>
  );
};

export default AdminUpdateRequestInfo;
