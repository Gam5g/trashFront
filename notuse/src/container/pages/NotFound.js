import React from "react";

function NotFound() {
  return (
    <div>
      <img
        src={"../../../images/sad.jpg"}
        style={{ width: "500px", alignItems: "center" }}
        alt="없음"
      />
      <h2 style={{ textAlign: "center" }}>웹페이지를 표시할 수 없습니다.</h2>
    </div>
  );
}

export default NotFound;
