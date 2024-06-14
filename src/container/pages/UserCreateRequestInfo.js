import React from "react";
import SolutionDetail from "../../components/SolutionDetail";

const UserCreateRequestInfo = () => {
  return (
    <div style={{ marginTop: "300px" }}>
      <h1>내가 생성 요청한 정보 ＞</h1>
      <SolutionDetail type="user" />
    </div>
  );
};

export default UserCreateRequestInfo;
