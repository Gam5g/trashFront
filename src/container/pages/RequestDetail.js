import React from "react";
import SolutionDetail from "../../components/SolutionDetail";
import "./Community/Paging.css";
import "./RequestList.css";

// RequestCreateList, RequestDetail, RequestModifiedList 모두 관리자 로그인에서 나와야 할 페이지같음

const RequestDetail = () => {
  return (
    <div>
      <SolutionDetail type="create" />
    </div>
  );
};

export default RequestDetail;
