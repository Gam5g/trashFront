import React, { useState } from "react";
import Pagination from "react-js-pagination";
import "./Paging.css";

const Paging = ({ totalItemsCount, onPageChange }) => {
  const [activePage, setActiveChange] = useState(1);

  const handlePageChange = (page) => {
    setActiveChange(page);
    onPageChange(page); // 부모 컴포넌트로 페이지 변경을 알림
  };

  return (
    <Pagination
      style={{ justifyContent: "center" }}
      activePage={activePage}
      itemsCountPerPage={10} // 한 페이지랑 보여줄 아이템 갯수
      totalItemsCount={totalItemsCount} // 총 아이템 갯수
      pageRangeDisplayed={5} // paginator의 페이지 범위
      prevPageText={"‹"} // "이전"을 나타낼 텍스트
      nextPageText={"›"} // "다음"을 나타낼 텍스트
      onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
    />
  );
};

export default Paging;
