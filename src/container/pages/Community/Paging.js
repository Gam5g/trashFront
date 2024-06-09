import React, { useState } from "react";
import Pagination from "react-js-pagination";
import "./Paging.css";

const Paging = ({ totalItemsCount, onPageChange, activePage }) => {
  const [internalActivePage, setInternalActivePage] = useState(activePage);

  const handlePageChange = (page) => {
    setInternalActivePage(page);
    onPageChange(page); // 부모 컴포넌트로 페이지 변경을 알림
  };

  const totalCount = parseInt(totalItemsCount);

  return (
    <Pagination
      style={{ justifyContent: "center" }}
      activePage={internalActivePage} // 내부적으로 설정한 activePage 상태를 사용
      itemsCountPerPage={10}
      totalItemsCount={totalCount}
      pageRangeDisplayed={5}
      prevPageText={"‹"}
      nextPageText={"›"}
      activeClass="active-page"
      onChange={handlePageChange}
    />
  );
};

export default Paging;
