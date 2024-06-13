import React from "react";
import CompareForm from "../../components/CompareForm";

const UserUpdateRequestInfo = () => {
  return (
    <div>
      <h1>내가 수정 요청한 정보 ＞</h1>
      <CompareForm type="user" />
    </div>
  );
};

export default UserUpdateRequestInfo;
