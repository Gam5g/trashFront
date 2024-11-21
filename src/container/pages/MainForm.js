import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthToken from "./AuthToken";
import { useMediaQuery } from "react-responsive";
import "./MainForm.css";
import "../../style.css";
import "../../components/Card";
import "../../components/CardContainer";
import CardContainer from "../../components/CardContainer";

function MainForm() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [recentBoardList, setRecentBoardList] = useState([]);
  const [recommendBoardList, setRecommendBoardList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await AuthToken.get(`/account/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        localStorage.setItem("accountId", response.data.accountId);
        localStorage.setItem("nickname", response.data.nickname);
        localStorage.setItem("latitude", response.data.latitude);
        localStorage.setItem("longitude", response.data.longitude);
      } catch (error) {}
    })();
  }, [accessToken]);

  const isAdmin = localStorage.getItem("accountName") === "admin";

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const recent_response = await AuthToken.get(
          `/solution?page=0&size=25`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const inputData_recent = recent_response.data.content.map((data) => ({
          wasteId: data.wasteId,
          wasteName: data.wasteName,
          state: data.state,
          createdDate: data.createdDate,
        }));
        setRecentBoardList(inputData_recent);
        const response = await AuthToken.get(
          `/questionBoard/read/4/paging?page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const inputData = response.data.content.map((data) => ({
          id: data.id,
          title: data.title,
          writer: data.writer,
          adopted: data.adopted,
        }));
        setBoardList(inputData.slice(0, 6));

        const response_recommend = await AuthToken.get(
          `/questionBoard/read/2/paging?page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const inputData_recommend = response_recommend.data.content.map(
          (data) => ({
            id: data.id,
            title: data.title,
            recommend: data.recommend,
            adopted: data.adopted,
          })
        );
        setRecommendBoardList(inputData_recommend.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoardData();
  }, []);

  const handleRequestClick = (wasteId) => {
    navigate(`/solution/detail/${wasteId}`, { state: { wasteId } });
  };

  const ScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePostClick = (post) => {
    navigate(`/community-bunri/${post.id}`);
  };

  return (
    <div className="main-form-margin">
      <div className="main-rule-container">
        <p className="main-rule-title-text">
          모두가 함께 만드는 분리배출, 분리위키
        </p>
        <p className="main-rule-subtitle-text">
          잘 모르는 분리 배출 방법을 아래에 알려드려요!
        </p>
        <div className="card-container">
          <CardContainer />
        </div>
      </div>
      <button onClick={ScrollToTop} className="MoveTopBtn" />
      <div>
        <div className="main-button-frame">
          <h2 className="main-button-text">더 많은 분리배출 방법 보러 가기</h2>
          <div className="main-button-container">
            <button
              className="main-button"
              onClick={() => navigate("/solution/total/list")}
            >
              전체 솔루션 목록
            </button>
            <button
              className="main-button"
              onClick={() => navigate("/wiki/total/list")}
            >
              전체 위키 목록
            </button>
            <button
              className="main-button"
              onClick={() => navigate("/categories")}
            >
              카테고리별로 보기
            </button>
            <button
              className="main-button"
              onClick={() => navigate("/solution/create")}
            >
              새 솔루션 올리기
            </button>
          </div>
        </div>
        <div className="two-box-container">
          <div className="main-list">
            <p className="main-list-title">최근 등록된 분리배출 방법</p>
            {recentBoardList
              .filter((boardItem) => boardItem.state === "ACCEPTED")
              .slice(0, 5)
              .map((boardItem, index) => (
                <div
                  className="main-list-content"
                  key={index}
                  onClick={() => handleRequestClick(boardItem.wasteId)}
                >
                  <div className="main-list-left-wrapper">
                    <p className="main-list-left-text">{boardItem.wasteName}</p>
                  </div>
                  <div className="main-list-right-wrapper">
                    <p className="main-list-right-text">
                      {new Date(boardItem.createdDate).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="main-list-second-content">
            <iframe
              width="573.33"
              height="473.33"
              src="https://www.youtube.com/embed/yYQCHZbrgB4?si=6UIogs_Ibj8mQF52"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div className="two-box-container">
          <div className="main-list">
            <p className="main-list-title">
              답변을 애타게 기다리는 분리수거 질문
            </p>
            {boardList
              .filter((boardItem) => !boardItem.adopted)
              .map((boardItem, index) => (
                <div
                  className="main-list-content"
                  key={index}
                  onClick={() => handlePostClick(boardItem)}
                >
                  <div className="main-list-left-wrapper">
                    <p className="main-list-left-text">{boardItem.title}</p>
                  </div>
                  <div className="main-list-right-wrapper">
                    <p className="main-list-right-text">{boardItem.writer}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="main-list">
            <p className="main-list-title">추천 수가 많은 커뮤니티 글</p>
            {recommendBoardList.map((boardItem, index) => (
              <div
                className="main-list-content"
                key={index}
                onClick={() => handlePostClick(boardItem)}
              >
                <div className="main-list-left-wrapper">
                  <p className="main-list-left-text">{boardItem.title}</p>
                </div>
                <div className="main-list-right-wrapper">
                  <p className="main-list-right-text">
                    {boardItem.recommend}개
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {isAdmin && (
          <div className="main-button-container">
            <br />
            <button
              className="white-button"
              onClick={() => navigate("/admin/update/request/list")}
              style={{ backgroundColor: "black", border: "none" }}
            >
              수정 요청 관리
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainForm;
