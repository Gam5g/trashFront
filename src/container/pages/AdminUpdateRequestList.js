import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SolutionList from "../../components/SolutionList";
const AdminUpdateRequestList = () => {
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
      <SolutionList type="admin" mode="update" />
    </div>
  );
};

export default AdminUpdateRequestList;
