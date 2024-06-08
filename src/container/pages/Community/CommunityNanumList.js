import React from "react";
import { useMediaQuery } from "react-responsive";
import CommunityList from "../../../components/CommunityList";
import "../../../Button.css";

const CommunityNanumList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  return (
    <div className="NotDrag">
      <h1
        style={
          isMobile ? { textAlign: "center", marginTop: "100px" } : undefined
        }
      >
        나눔 커뮤니티 ＞
      </h1>
      {isMobile ? (
        <h4 style={{ textAlign: "center" }}>
          사람들과 나눔을 시작하고 환경에 한 걸음 더 가까워져요
        </h4>
      ) : (
        <h3>사람들과 나눔을 시작하고 환경에 한 걸음 더 가까워져요</h3>
      )}
      <CommunityList postType="nanum" />
    </div>
  );
};

export default CommunityNanumList;
