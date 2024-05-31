import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./state/authState";
import "./style.css";

const Header = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setWidth(0);
  };

  const handleLogin = () => {
    navigate("/api/auth/sign-in");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      /*const response = await AuthToken.post("http://3.39.190.90/api/account/sign-out?accessToken={$accessToken}&RefreshToken={$RefreshToken}", {
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          },
        }
      }) */
    } catch {}
    alert("로그아웃되었습니다.");
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accountName");
    localStorage.removeItem("email");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude");
    navigate("/");
  };

  return (
    <header>
      <div className="logo" onClick={handleLogoClick}>
        <img src="/images/logo.png" alt="로고" style={{ cursor: "pointer" }} />
      </div>
      {isMobile ? (
        <>
          <div
            className="menu-icon"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setWidth(isMenuOpen ? 0 : 250); // 토글되도록 너비 설정
            }}
            style={{ cursor: "pointer" }}
          >
            <RxHamburgerMenu className="hamburger-menu" />
          </div>
          <div className="mobile-menu">
            <div className="side-menu" style={{ width: width }}>
              <ul className="mobile-side">
                <img
                  src="/images/logo.png"
                  alt="로고"
                  style={{ width: "150px", height: "auto" }}
                />
                <li>
                  {isLoggedIn ? (
                    <>
                      <a href="/" onClick={handleLogout}>
                        로그아웃
                      </a>
                      <a href="/my-page">마이페이지</a>
                    </>
                  ) : (
                    <a onClick={handleLogin} style={{ cursor: "pointer" }}>
                      로그인
                    </a>
                  )}
                </li>
                <li>
                  <a style={{ color: "darkgray" }}>커뮤니티</a>
                </li>

                <li>
                  <a href="/community-nanum">나눔</a>
                </li>

                <li>
                  <a href="/community-bunri">분리수거</a>
                </li>
                <li>
                  <a href="/medicine">수거함 위치</a>
                </li>
                <li>
                  <a href="/daegu-bunri-policy">대구의 분리수거 정책</a>
                </li>
              </ul>
            </div>
            <div
              className={`side-menu-overlay ${isMenuOpen ? "show" : ""}`}
              onClick={closeMenu}
            ></div>
          </div>
        </>
      ) : (
        <nav className={"navbar__menu"} style={{ fontFamily: "" }}>
          <ul>
            <li>
              {isLoggedIn ? (
                <>
                  <a href="/" onClick={handleLogout}>
                    로그아웃
                  </a>
                  <span className="separator">|</span>
                  <a href="/my-page">마이페이지</a>
                </>
              ) : (
                <a onClick={handleLogin} style={{ cursor: "pointer" }}>
                  로그인
                </a>
              )}
            </li>
            <span className="separator">ㅣ</span>
            <li>
              <a style={{ color: "green" }}>커뮤니티</a>
            </li>
            <li>
              <a href="/community-nanum">나눔</a>
            </li>
            <li>
              <a href="/community-bunri">분리수거</a>
            </li>
            <span className="separator">ㅣ</span>
            <li>
              <a href="/medicine">수거함 위치</a>
            </li>
            <li>
              <a href="/daegu-bunri-policy">대구의 분리수거 정책</a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
