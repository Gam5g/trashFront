import React from "react";
import SolutionList from "../../components/SolutionList";
import "./Community/Paging.css";
import "./RequestList.css";

const UserCreateRequestList = () => {
  return (
    <div>
      <SolutionList type="user" mode="create" />
    </div>
  );
};

export default UserCreateRequestList;
