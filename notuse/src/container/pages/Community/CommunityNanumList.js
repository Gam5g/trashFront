import React from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import CommunityList from "../../../components/CommunityList";
import { NanumPosts } from "./NanumPosts";
import "../../../Button.css";

const CommunityNanumList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1000px)" });
  const navigate = useNavigate();
  const navigateToBunri = () => {
    navigate(`/community-bunri/`);
  };

  return (
    <div>
      <h1>나눔 게시글 목록</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ width: isMobile ? "50%" : "100%" }}
          className="activeBtn"
        >
          나눔
        </button>
        <button
          style={{ width: isMobile ? "50%" : "100%" }}
          onClick={navigateToBunri}
          className="unactiveBtn"
        >
          분리수거
        </button>
      </div>
      <CommunityList posts={NanumPosts} postType="nanum" />
    </div>
  );
};

export default CommunityNanumList;
