import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";
import Modal from "./Modal";
import "./Detailform.css";
import "./Search.css";
import "./AdminInfo.css";
import "./WikiDetailForm.css";

const WikiDetailForm = ({ type, state }) => {
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [originList, setOriginList] = useState(null);
  const [modifiedList, setModifiedList] = useState({
    accountNickname: "",
    wasteName: "",
    categories: [],
    tags: [],
    solution: "",
    wikiState: "",
    createdDate: "",
    modifiedDate: "",
  });
  const [showDiff, setShowDiff] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [modalOpen, setModalOpen] = useState(false);
  const { wikiId } = useParams();

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인 한 후에 글을 작성할 수 있습니다.");
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!wikiId) {
      alert("다시 시도해 주세요.");
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await AuthToken.get(`/wiki/${wikiId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        if (data.origin === null) {
          setOriginList(null);
        } else {
          const originCreatedDate = new Date(
            data.origin.createdDate
          ).toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          const originModifiedDate = new Date(
            data.origin.modifiedDate
          ).toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
          const originData = {
            accountNickname: data.origin.accountNickname,
            wasteName: data.origin.wasteName,
            categories: data.origin.categories,
            tags: data.origin.tags,
            solution: data.origin.solution,
            wikiState: data.origin.wikiState,
            createdDate: originCreatedDate,
            modifiedDate: originModifiedDate,
          };
          setOriginList(originData);
        }

        const modifiedCreatedDate = new Date(
          data.modified.createdDate
        ).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const modifiedModifiedDate = new Date(
          data.modified.modifiedDate
        ).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const modifiedData = {
          accountId: data.modified.accountId,
          accountNickname: data.modified.accountNickname,
          wasteName: data.modified.wasteName,
          categories: data.modified.categories,
          tags: data.modified.tags,
          solution: data.modified.solution,
          wikiState: data.modified.wikiState,
          createdDate: modifiedCreatedDate,
          modifiedDate: modifiedModifiedDate,
        };
        setModifiedList(modifiedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    };
    fetchData();
  }, [accessToken, navigate, wikiId]);

  const navigateToHome = () => {
    navigate(`/`);
  };

  const navigateToBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modifiedList.categories.length === 0) {
      alert("적어도 하나의 재질을 선택해야 합니다.");
      return;
    }

    if (modifiedList.tags.length === 0) {
      alert("적어도 하나의 태그를 입력해야 합니다.");
      return;
    }

    if (!modifiedList.solution.trim()) {
      alert("배출 방법을 입력해야 합니다.");
      return;
    }

    setShowDiff(true);
    const formData = new FormData();
    formData.append("categories", modifiedList.categories);
    formData.append("solution", modifiedList.solution);
    formData.append("tags", modifiedList.tags);
    try {
      await AuthToken.post(`/solution/${wikiId}/wiki`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (
          data.cause === "EXIST_WIKI" ||
          data.cause === "ConstraintViolationException"
        ) {
          alert(data.message);
        } else {
          console.error(data);
        }
      } else {
        console.error(error);
      }
    }
  };

  const handleDelete = async (e) => {
    try {
      if (window.confirm("해당 수정 내용을 삭제하시겠습니까? ")) {
        await AuthToken.delete(`/wiki/${wikiId}`, {
          params: {
            userId: modifiedList.accountId,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("해당 위키의 수정 요청이 삭제되었습니다.");
        navigateToBack();
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleAdminAccept = async (e) => {
    try {
      if (window.confirm("해당 위키에 대해서 요청을 승인하시겠습니까?")) {
        await AuthToken.put(`/wiki/${wikiId}/accepted`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("해당 위키의 요청이 승인되었습니다.");
        navigateToBack();
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleAdminRejected = async (e) => {
    try {
      if (window.confirm("해당 위키에 대해서 요청을 거부하시겠습니까?")) {
        await AuthToken.put(`/wiki/${wikiId}/rejected`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert("해당 위키의 요청이 거부되었습니다.");
        navigateToBack();
      }
    } catch (error) {
      if (error.response.data.cause === "EMPTY_WIKI") {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };

  return (
    <div className="wiki-detail-container">
      {type === "admin" && (
        <div className="admin-text">
          <p className="admin-info-text">관리자 로그인</p>
          <h1>수정 요청 받은 정보</h1>
        </div>
      )}

      {type === "user" ? (
        <>
          <h1>내가 수정 요청한 정보 ＞</h1>
          <h1>{modifiedList.wasteName} 항목의 수정내용 ＞</h1>
        </>
      ) : (
        <h1>{modifiedList.wasteName} 항목의 수정내용 ＞</h1>
      )}

      <div className="solution-container">
        <div className="solution-info">
          <span className="nickname">{modifiedList.accountNickname}</span>
        </div>
        <div className="solution-status">
          {modifiedList.wikiState === "ACCEPTED"
            ? "✔️"
            : modifiedList.wikiState === "PENDING"
              ? "대기"
              : "❌"}
          <div>
            <span className="date">{modifiedList.modifiedDate}</span>
          </div>
        </div>
      </div>
      <div
        className="button-container"
        style={
          modifiedList.wikiState !== "PENDING" ? { marginTop: "100px" } : {}
        }
      >
        {originList && originList.wasteName && (
          <div
            style={
              modifiedList.wikiState === "PENDING" && state !== "update"
                ? { marginTop: "100px" }
                : {}
            }
          >
            <div className="origin-title">원본</div>
            <div className="origin-container" style={{ height: "800px" }}>
              <>
                <p className="result-title">{originList.wasteName}</p>
                <h3 className="result-type-text">재질</h3>
                <p className="result-text">{originList.categories}</p>
                <h3 className="result-type-text">태그</h3>
                <p className="result-text">{originList.tags}</p>
                <h3 className="result-type-text">배출요령</h3>
                <p className="result-text">{originList.solution}</p>
              </>
            </div>
          </div>
        )}
        <div>
          <div className="modified-title">{originList ? "기본" : "수정"}</div>
          <form
            onSubmit={handleSubmit}
            className={"modified-container"}
            style={{ height: "800px" }}
          >
            <>
              <p className="result-title">{modifiedList.wasteName}</p>
              {modifiedList.accountNickname !== "midas" && (
                <>
                  <h3 className="result-type-text">작성자</h3>
                  <p
                    className="result-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalOpen(true)}
                  >
                    {modifiedList.accountNickname}
                  </p>{" "}
                </>
              )}
              <h3 className="result-type-text">재질</h3>
              <p className="result-text">{modifiedList.categories}</p>
              <h3 className="result-type-text">태그</h3>
              <p className="result-text">{modifiedList.tags}</p>
              <h3 className="result-type-text">배출요령</h3>
              <p className="result-text">{modifiedList.solution}</p>
            </>
          </form>
          {type === "edit" && (
            <div className="button-container">
              <button
                type="submit"
                onClick={handleSubmit}
                className="submitbutton"
              >
                생성 요청하기
              </button>

              <button className="cancelbutton" onClick={navigateToHome}>
                취소
              </button>
            </div>
          )}
        </div>
      </div>
      {type === "admin" && modifiedList.wikiState === "PENDING" && isAdmin && (
        <div className="button-container">
          <button
            type="submit"
            onClick={handleAdminAccept}
            className="wiki-accept-button"
          >
            수정사항 승인
          </button>
          <button className="wiki-reject-button" onClick={handleAdminRejected}>
            수정사항 거절
          </button>
        </div>
      )}
      <div
        className="button-container"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <button
          className="cancelbutton"
          onClick={navigateToBack}
          style={{
            width: "200px",
            alignItems: "center",
          }}
        >
          이전 페이지로 돌아가기
        </button>
        {modifiedList.accountNickname === localStorage.getItem("accountName") &&
          modifiedList.wikiState === "PENDING" && (
            <button
              className="deleteButton"
              style={{
                width: "100px",
                height: "45px",
                marginLeft: "20px",
                marginBottom: "-60px",
              }}
              onClick={handleDelete}
            >
              삭제하기
            </button>
          )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        accountId={modifiedList.accountId}
      />
    </div>
  );
};

export default WikiDetailForm;
