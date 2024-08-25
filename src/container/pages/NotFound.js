import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      className="NotDrag"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img
        src={"../../../images/sad.jpg"}
        style={{ width: "500px" }}
        alt="없음"
      />
      <h2 style={{ textAlign: "center" }}>없는 결과입니다.</h2>
      <button
        className="white-button"
        style={{
          marginTop: "20px",
          width: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => navigate(`/community-bunri/write`)}
      >
        분리수거 게시판에 글 쓰러 가기
      </button>
    </div>
  );
}

export default NotFound;
