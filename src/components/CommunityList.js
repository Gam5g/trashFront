import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import Paging from "../container/pages/Community/Paging";
import "../Button.css";
import "../container/pages/Community/Community.css";

const CommunityList = ({ posts, postType }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("page");
  const [searchBy, setSearchBy] = useState("title");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const NavigateToWrite = () => {
    navigate(`/community-${postType}/write`);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/community-${postType}/${post.id}`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleSearch = () => {
    const filtered = posts.filter((post) => {
      if (searchBy === "title") {
        return post.title.includes(query);
      } else if (searchBy === "nickname") {
        return post.nickname.includes(query);
      }
      return false;
    });
    if (filtered.length === 0) {
      window.confirm("검색 결과가 없습니다.");
    } else {
      setSearchResults(filtered);
      setPage(1);
    }
  };

  const sortedPostsByCriteria = (posts) => {
    if (sortBy === "nanum") {
      return posts.filter((post) => post.nanum);
    }
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case "page":
          return b.id - a.id;
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "likes":
          return b.likes - a.likes;
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });
  };

  const paginatedPosts = sortedPostsByCriteria(
    searchResults.length > 0 ? searchResults : posts
  ).slice((page - 1) * 10, page * 10);

  return (
    <>
      <div className="NotDrag">
        {isMobile ? (
          <table className="mobile-table-container">
            {paginatedPosts.map((post) => (
              <tr key={post.id} onClick={() => handlePostClick(post)}>
                <p className="title">
                  {post.title.length > 40
                    ? post.title.slice(0, 40) + "..."
                    : post.title}
                </p>
                <div>
                  <p className="info">
                    {post.nickname} | 조회수 {post.views} | 추천수 {post.likes}{" "}
                    | {post.date}
                    {postType === "nanum" &&
                      (post.nanum === "O" ? " | 나눔 완료" : " | 나눔 진행 중")}
                  </p>
                </div>
              </tr>
            ))}
          </table>
        ) : (
          <table className="table-container">
            <thead>
              <tr>
                <th>글 번호</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>조회수</th>
                <th>추천수</th>
                <th>작성날짜</th>
                {postType === "nanum" && <th>나눔 완료</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => (
                <tr key={post.id} onClick={() => handlePostClick(post)}>
                  <td>{post.id}</td>
                  <td>
                    {post.title.length > 30
                      ? post.title.slice(0, 30) + "..."
                      : post.title}
                  </td>
                  <td>{post.nickname}</td>
                  <td>{post.views}</td>
                  <td>{post.likes}</td>
                  <td>{post.date}</td>
                  {postType === "nanum" && <td>{post.nanum}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div
          className={isMobile ? "" : "search-controls"}
          style={{ paddingTop: "20px" }}
        >
          <select
            className="sort-container"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="page">페이지 번호순 정렬</option>
            <option value="likes">추천순 정렬</option>
            <option value="views">조회순 정렬</option>
            <option value="date">작성날짜순 정렬</option>
            {postType === "nanum" && (
              <option value="nanum">나눔완료순 정렬</option>
            )}
          </select>
          {isMobile ? <div style={{ marginBottom: "15px" }} /> : <></>}
          <div className="search-container">
            <select
              className="searchBy-container"
              value={searchBy}
              onChange={handleSearchChange}
            >
              <option value="title">제목</option>
              <option value="nickname">글쓴이</option>
            </select>
            <input
              type="text"
              placeholder="입력"
              className="community-search-input"
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button className="searchbutton" onClick={handleSearch}>
              검색
            </button>
            {!isMobile &&
              (isLoggedIn ? (
                <button
                  className="write-green-button"
                  onClick={NavigateToWrite}
                >
                  글쓰기
                </button>
              ) : (
                <button className="disabled-write-button">글쓰기</button>
              ))}
          </div>
        </div>

        <div>
          <Paging
            totalItemsCount={
              searchResults.length > 0 ? searchResults.length : posts.length
            }
            onPageChange={handlePageChange}
          />
          {isMobile &&
            (isLoggedIn ? (
              <button className="write-green-button" onClick={NavigateToWrite}>
                글쓰기
              </button>
            ) : (
              <button className="disabled-write-button">글쓰기</button>
            ))}
        </div>
      </div>
    </>
  );
};

export default CommunityList;
