import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useMediaQuery } from "react-responsive";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./state/authState";
import "./style.css";

const Header = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [, , removeCookie] = useCookies(["accessToken"]);
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
    setIsLoggedIn(false);
    removeCookie("accessToken", { path: "/" });
    localStorage.removeItem("accessToken");
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
                  <a href="/medicine-location">폐의약품 위치</a>
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
              <a>커뮤니티</a>
            </li>
            <li>
              <a href="/community-nanum">나눔</a>
            </li>
            <li>
              <a href="/community-bunri">분리수거</a>
            </li>
            <span className="separator">ㅣ</span>
            <li>
              <a href="/medicine-location">폐의약품 위치</a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
