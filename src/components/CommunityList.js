import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../state/authState";
import Paging from "../container/pages/Community/Paging";
import AuthToken from "../container/pages/AuthToken";
import "../Button.css";
import "../container/pages/Community/Community.css";

const CommunityList = ({ posttype }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [boardList, setBoardList] = useState([
    {
      id: "",
      title: "",
      recommend: "",
      writer: "",
      adopted: "",
      view: "",
    },
  ]);
  const [option, setOption] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const NavigateToWrite = () => {
    navigate(`/community-${posttype}/write`);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/community-${posttype}/${post.id}`);
  };

  const handleSearchChange = (e) => {
    setSearchBy(e.target.value);
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        let url = "";
        let storageKey = "";

        if (posttype === "bunri") {
          url = `/questionBoard/read/${option}/paging?page=${page}`;
          storageKey = "bunri-totalElements";
        } else if (posttype === "nanum") {
          url = `/recycleBoard/read/${option}/paging?page=${page}`;
          storageKey = "nanum-totalElements";
        } else if (posttype === "mylist") {
          url = ``;
        }

        const response = await AuthToken.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const inputData = response.data.content.map((data) => ({
          id: data.id,
          title: data.title,
          recommend: data.recommend,
          writer: data.writer,
          adopted: data.adopted,
          collection: data.collection,
          view: data.view,
        }));
        setBoardList(inputData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoardData();
  }, [posttype, page, option]);

  const handleSearch = () => {
    const filtered = boardList.filter((post) => {
      if (searchBy === "title") {
        return post.title.includes(query);
      } else if (searchBy === "writer") {
        return post.writer.includes(query);
      }
      return false;
    });

    if (filtered.length === 0) {
      window.confirm("검색 결과가 없습니다.");
      setSearchResults([]);
    } else {
      setSearchResults(filtered);
    }
  };

  return (
    <>
      <div className="NotDrag">
        {isMobile ? (
          <table className="mobile-table-container">
            <tbody>
              {(searchResults.length > 0 ? searchResults : boardList).map(
                (post) => (
                  <tr key={post.id} onClick={() => handlePostClick(post)}>
                    <td>
                      <p className="title">
                        {post.title.length > 40
                          ? post.title.slice(0, 40) + "..."
                          : post.title}
                      </p>
                      <div>
                        <p className="info">
                          {post.writer} | 조회수 {post.view} | 추천수{" "}
                          {post.recommend} | {post.date}
                          {posttype === "nanum" &&
                            (post.collection === true
                              ? " | 나눔 완료"
                              : " | 나눔 진행 중")}
                          {posttype === "bunri" &&
                            (post.adopted === true
                              ? " | 채택 완료"
                              : " | 채택 미완료")}
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <table className="table-container">
            <thead>
              <tr>
                <th>글 번호</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>조회수</th>
                {posttype === "bunri" && <th>추천수</th>}
                {posttype === "nanum" && <th>나눔 완료</th>}
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0 ? searchResults : boardList).map(
                (post) => (
                  <tr key={post.id} onClick={() => handlePostClick(post)}>
                    <td>{post.id}</td>
                    <td>
                      {post.adopted === true ? (
                        <>
                          <img
                            src="images/adopted.png"
                            alt="adopted"
                            className="adopted-icon"
                            style={{
                              width: "15%",
                              height: "10%",
                            }}
                          />
                          {post.title.length > 30 ? (
                            <>{post.title.slice(0, 30) + "..."}</>
                          ) : (
                            <>{post.title}</>
                          )}
                        </>
                      ) : post.title.length > 30 ? (
                        <>{post.title.slice(0, 30) + "..."}</>
                      ) : (
                        <>{post.title}</>
                      )}
                    </td>
                    <td>{post.writer}</td>
                    <td>{post.view}</td>
                    {posttype === "bunri" && <td>{post.recommend}</td>}
                    {posttype === "nanum" &&
                      (post.collection === true ? <td>O</td> : <td>X</td>)}
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}

        <div
          className={isMobile ? "" : "search-controls"}
          style={{ paddingTop: "20px" }}
        >
          <select
            className="sort-container"
            onChange={(e) => setOption(e.target.value)}
            value={option}
          >
            <option value="1">페이지 번호순 정렬</option>
            <option value="2">추천순 정렬</option>
            <option value="3">조회순 정렬</option>
          </select>
          {isMobile ? <div style={{ marginBottom: "15px" }} /> : <></>}
          <div className="search-container">
            <select
              className="searchBy-container"
              value={searchBy}
              onChange={handleSearchChange}
            >
              <option value="title">제목</option>
              <option value="writer">글쓴이</option>
            </select>
            <input
              type="text"
              placeholder="입력"
              className="community-search-input"
              value={query}
              onChange={(e) => {
                console.log("Query Changed : ", e.target.value);
                setQuery(e.target.value);
              }}
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
              searchResults.length > 0
                ? searchResults.length
                : posttype === "bunri"
                  ? parseInt(localStorage.getItem("bunri-totalElements"), 10)
                  : parseInt(localStorage.getItem("nanum-totalElements"), 10)
            }
            onPageChange={setPage}
            activePage={page}
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
