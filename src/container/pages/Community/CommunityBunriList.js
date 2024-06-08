import React from "react";
import { useMediaQuery } from "react-responsive";
import CommunityList from "../../../components/CommunityList";
import "../../../Button.css";

const CommunityBunriList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  return (
    <div className="NotDrag">
      <h1
        style={
          isMobile ? { textAlign: "center", marginTop: "100px" } : undefined
        }
      >
        분리수거 커뮤니티 ＞
      </h1>
      {isMobile ? (
        <h4 style={{ textAlign: "center" }}>
          헷갈리거나 모르는 쓰레기의 분리수거 방법을 질문해요. 정보성 글도
          괜찮아요!
        </h4>
      ) : (
        <h3>
          헷갈리거나 모르는 쓰레기의 분리수거 방법을 질문해요. 정보성 글도
          괜찮아요!
        </h3>
      )}
      <CommunityList postType="bunri" />
    </div>
  );
};

export default CommunityBunriList;
