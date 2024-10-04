import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./state/authState";
import { useForm } from "react-hook-form";
import { HiXCircle } from "react-icons/hi";
import AuthToken from "./container/pages/AuthToken";
import "./header.css";

const Header = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searchDetails, setSearchDetails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const { register, handleSubmit, reset, watch } = useForm();
  const [isSearchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const searchTerm = watch("searchTerm");
  useEffect(() => {
    const fetchRelatedSearches = async () => {
      if (!searchTerm) return;

      try {
        const response = await AuthToken.get(
          `/solution/search?keyword=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data && Array.isArray(response.data.content)) {
          setSearchDetails(response.data.content.slice(0, 4));
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching related searches:", error);
      }
    };

    fetchRelatedSearches();
  }, [searchTerm]);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setWidth(0);
  };

  const handleLogin = () => {
    navigate("/sign-in");
  };

  const onSubmit = async (data) => {
    const searchTerm = data.searchTerm.trim();
    if (!searchTerm) {
      return; // 검색어가 비어있으면 종료
    }
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    try {
      const response = await AuthToken.get(
        `/solution/keyword?keyword=${encodedSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSearchResults([response.data]);
      navigateToSearch(searchTerm, response.data);
    } catch (error) {
      let errorResponse;
      try {
        errorResponse = JSON.parse(error.request.response);
      } catch (e) {
        console.error("Error parsing response:", e);
      }
      if (errorResponse && errorResponse.cause === "WASTE_NOT_FOUND") {
        navigate(`/search/not-found`);
      }
    }
    reset();
  };
  const navigateToSearch = async (selectedQuery) => {
    console.log("navigateToSearch called with:", selectedQuery); // 디버깅용 로그

    try {
      const response = await AuthToken.get(
        `/solution/keyword?keyword=${encodeURIComponent(selectedQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data); // API 응답 출력
      setSearchResults([response.data]);

      // 검색 결과 페이지로 이동
      navigate(`/search?query=${encodeURIComponent(selectedQuery)}`, {
        state: response.data,
      });
    } catch (error) {
      console.error("Error performing search for selected query:", error);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
    localStorage.clear();
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleCamera = (e) => {
    navigate("/camera");
  };

  const handleSearchButtonClick = async (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <span className="bunri-logo" onClick={handleLogoClick}>
            BUNRI
          </span>
          <span className="wiki-logo" onClick={handleLogoClick}>
            WiKi
          </span>
        </div>
        {isMobile ? (
          <>
            <div
              className="menu-icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ cursor: "pointer" }}
            >
              <RxHamburgerMenu
                className="hamburger-menu"
                aria-label="메뉴 열기"
              />
            </div>
            <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
              <div className="side-menu">
                <ul className="mobile-side">
                  <div className="logo">
                    <span className="bunri-logo">BUNRI</span>
                    <span className="wiki-logo">WiKi</span>
                  </div>
                  <li>
                    {isLoggedIn ? (
                      <>
                        <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                          로그아웃
                        </a>
                        <a href="/my-page">마이페이지</a>
                      </>
                    ) : (
                      <a onClick={handleLogin}>로그인</a>
                    )}
                  </li>
                  <li>
                    <a href="/community-nanum">나눔 커뮤니티</a>
                  </li>
                  <li>
                    <a href="/community-bunri">분리수거 커뮤니티</a>
                  </li>
                  <li>
                    <a href="/medicine">수거함 위치</a>
                  </li>
                  <li>
                    <a href="/daegu-bunri-policy">대구 재활용 안내</a>
                  </li>
                </ul>
              </div>
              {isMenuOpen && (
                <div className="side-menu-overlay" onClick={closeMenu}></div>
              )}
            </div>
          </>
        ) : (
          <>
            <nav className="nav-menu">
              <div className="community-container">
                <a className="community-link">커뮤니티</a>
                <div className="community-dropdown">
                  <a href="/community-bunri">분리수거</a>
                  <a href="/community-nanum">나눔</a>
                </div>
              </div>
              <a href="/medicine">수거함 위치</a>
              <a href="/daegu-bunri-policy">대구 재활용 안내</a>
            </nav>
            <form
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className={
                isSearchFocused &&
                watch("searchTerm").length > 0 &&
                searchDetails.length > 0
                  ? "long-search-bar"
                  : "search-bar"
              }
              onFocus={() => setSearchFocused(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  // related-search-item를 클릭하는 경우에는 blur 이벤트를 막아줌
                  setSearchFocused(false);
                }
              }}
            >
              <input
                type="text"
                {...register("searchTerm")}
                placeholder="이름 또는 태그로 검색하기"
              />
              {watch("searchTerm") && (
                <HiXCircle
                  className="clear-search-button"
                  onClick={() => reset({ searchTerm: "" })}
                  size={20}
                />
              )}
              <button
                type="submit"
                className="header-search-button"
                aria-label="검색"
                onClick={handleSearchButtonClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31.2148 29.1214C33.0618 26.7393 33.9322 23.7428 33.6491 20.7414C33.3659 17.7401 31.9505 14.9594 29.6907 12.965C27.4308 10.9706 24.4964 9.91243 21.4844 10.0057C18.4723 10.0989 15.6089 11.3366 13.4767 13.4669C11.3426 15.5987 10.1014 18.4644 10.0059 21.4799C9.91051 24.4954 10.9681 27.4339 12.9631 29.6965C14.9581 31.9591 17.7404 33.3755 20.7431 33.6571C23.7458 33.9387 26.7428 33.0643 29.1234 31.2121L29.1871 31.2788L35.4701 37.5658C35.6077 37.7034 35.7711 37.8126 35.9509 37.8871C36.1307 37.9617 36.3234 38 36.518 38C36.7127 38 36.9054 37.9617 37.0852 37.8871C37.265 37.8126 37.4283 37.7034 37.5659 37.5658C37.7036 37.4281 37.8127 37.2647 37.8872 37.0848C37.9617 36.9049 38 36.7121 38 36.5174C38 36.3228 37.9617 36.13 37.8872 35.9501C37.8127 35.7702 37.7036 35.6068 37.5659 35.4691L31.2815 29.1836L31.2148 29.1214ZM28.14 15.5636C28.9762 16.3866 29.6413 17.3672 30.0969 18.4487C30.5524 19.5302 30.7894 20.6912 30.7942 21.8648C30.799 23.0384 30.5714 24.2013 30.1247 25.2865C29.678 26.3716 29.0209 27.3576 28.1914 28.1874C27.3618 29.0173 26.3763 29.6746 25.2915 30.1215C24.2068 30.5685 23.0443 30.7961 21.8712 30.7913C20.6981 30.7865 19.5376 30.5494 18.4565 30.0937C17.3754 29.638 16.3952 28.9726 15.5725 28.136C13.9283 26.4642 13.0111 24.2101 13.0207 21.8648C13.0302 19.5195 13.9657 17.273 15.6235 15.6146C17.2812 13.9562 19.5268 13.0203 21.8712 13.0107C24.2156 13.0012 26.4688 13.9187 28.14 15.5636Z"
                    fill="#6C8D40"
                  />
                </svg>
              </button>
              <button
                className="header-camera-button"
                aria-label="카메라"
                onClick={handleCamera}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M36.8 13.1111H31.728L28.8 10H19.2L16.272 13.1111H11.2C10.3513 13.1111 9.53737 13.4389 8.93726 14.0223C8.33714 14.6058 8 15.3971 8 16.2222V34.8889C8 35.714 8.33714 36.5053 8.93726 37.0888C9.53737 37.6722 10.3513 38 11.2 38H36.8C37.6487 38 38.4626 37.6722 39.0627 37.0888C39.6629 36.5053 40 35.714 40 34.8889V16.2222C40 15.3971 39.6629 14.6058 39.0627 14.0223C38.4626 13.4389 37.6487 13.1111 36.8 13.1111ZM36.8 34.8889H11.2V16.2222H17.68L20.608 13.1111H27.392L30.32 16.2222H36.8V34.8889ZM24 17.7778C21.8783 17.7778 19.8434 18.5972 18.3431 20.0558C16.8429 21.5145 16 23.4928 16 25.5556C16 27.6184 16.8429 29.5967 18.3431 31.0553C19.8434 32.5139 21.8783 33.3333 24 33.3333C26.1217 33.3333 28.1566 32.5139 29.6569 31.0553C31.1571 29.5967 32 27.6184 32 25.5556C32 23.4928 31.1571 21.5145 29.6569 20.0558C28.1566 18.5972 26.1217 17.7778 24 17.7778ZM24 30.2222C22.727 30.2222 21.5061 29.7306 20.6059 28.8554C19.7057 27.9802 19.2 26.7932 19.2 25.5556C19.2 24.3179 19.7057 23.1309 20.6059 22.2557C21.5061 21.3806 22.727 20.8889 24 20.8889C25.273 20.8889 26.4939 21.3806 27.3941 22.2557C28.2943 23.1309 28.8 24.3179 28.8 25.5556C28.8 26.7932 28.2943 27.9802 27.3941 28.8554C26.4939 29.7306 25.273 30.2222 24 30.2222Z"
                    fill="#6C8D40"
                  />
                </svg>
              </button>
              {isSearchFocused &&
                watch("searchTerm") &&
                searchDetails.length > 0 && (
                  <div className="related-searches" tabIndex="-1">
                    {searchDetails.map((item, index) => (
                      <div
                        key={index}
                        className="related-search-item"
                        tabIndex="0"
                        onMouseDown={(e) => {
                          e.preventDefault(); // blur 이벤트 막기
                          navigateToSearch(item.name);
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
            </form>
            <div className="auth-links">
              {isLoggedIn ? (
                <>
                  <a onClick={handleLogout}>로그아웃</a>
                  <a href="/my-page">마이페이지</a>
                </>
              ) : (
                <>
                  <a onClick={handleLogin}>로그인</a>
                  <a href="/sign-up">회원가입</a>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
