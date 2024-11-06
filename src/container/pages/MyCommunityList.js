import React from "react";
import { useMediaQuery } from "react-responsive";
import CommunityList from "../../components/CommunityList";

const MyCommunityList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  return (
    <div className="NotDrag">
      <h1
        style={
          isMobile ? { textAlign: "center", marginTop: "70px" } : undefined
        }
      >
        내 게시물 보기 ＞
      </h1>
      <CommunityList posttype="mylist" />
    </div>
  );
};

export default MyCommunityList;
