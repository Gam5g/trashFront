import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const AdminForm = () => {
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      alert("잘못된 접근입니다.");
      navigate("/");
    }
  }, [isAdmin, navigate]);
  return (
    <div>
      <p>관리자만 볼 수 있어요</p>
    </div>
  );
};

export default AdminForm;
