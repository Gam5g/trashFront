import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WikiDetailForm from "./WikiDetailForm";

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
    <div>
      <WikiDetailForm type="admin" state="update" />
    </div>
  );
};

export default AdminUpdateRequestInfo;
