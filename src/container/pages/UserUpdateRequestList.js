import React from "react";
import SolutionList from "../../components/SolutionList";
import "./Community/Paging.css";
import "./RequestList.css";

const UserUpdateRequestList = () => {
  return (
    <div>
      <SolutionList type="user" mode="update" />
    </div>
  );
};

export default UserUpdateRequestList;
