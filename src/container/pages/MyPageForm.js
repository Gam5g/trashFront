import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";
import "./MyPageForm.css";
import { useCookies } from "react-cookie";

function MyPageForm() {
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie] = useCookies(["accessToken"]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    } else {
      (async () => {
        try {
          const response = await AuthToken.get(`/account/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAccount(response.data);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("nickname", response.data.nickname);
        } catch (error) {
          console.error("Failed to fetch account data:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isLoggedIn, navigate]);

  const onNicknameUpdate = async () => {
    navigate("/my-page/update/nickname");
  };

  const onEmailUpdate = async () => {
    navigate("/my-page/update/email");
  };

  const navigateToList = () => {
    navigate("list");
  };

  const navigateToModifiedList = () => {
    navigate("/update/request/list");
  };

  const navigateToCreateList = () => {
    navigate("/create/request/list");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  /*if (loading) {
    return <div className="loading">Loading...</div>;
  }*/

  return (
    <div className="padding-layout">
      <div className="myPage">
        <h2>회원정보</h2>
        {account ? (
          <div className="accountInfo">
            <div className="section">
              <hr />
              <h3>계정</h3>
              <ul>
                <li>아이디: {account.accountName}</li>
                <li className="clickable" onClick={onNicknameUpdate}>
                  닉네임 변경: {account.nickname}
                </li>
                <li className="clickable" onClick={onEmailUpdate}>
                  이메일 변경: {account.email}
                </li>
                <li>비밀번호 변경</li>
              </ul>
            </div>
            <div className="section">
              <hr />
              <h3>커뮤니티</h3>
              <ul>
                <li className="clickable" onClick={navigateToList}>
                  내 게시물 보기
                </li>
              </ul>
            </div>
            {!isAdmin && (
              <div className="section">
                <hr />
                <h3>나의 위키 편집 요청</h3>
                <ul>
                  <li className="clickable" onClick={navigateToModifiedList}>
                    내가 수정 요청한 정보 보기
                  </li>
                  <li className="clickable" onClick={navigateToCreateList}>
                    내가 생성 요청한 정보 보기
                  </li>
                </ul>
              </div>
            )}
            <div className="section">
              <hr />
              <h3>위치정보</h3>
              <ul>
                <li>경도: {account.latitude}</li>
                <li>위도: {account.longitude}</li>
              </ul>
            </div>
            <div className="section">
              <hr />
              <h3>기타</h3>
            </div>
          </div>
        ) : (
          <div>계정 정보를 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default MyPageForm;
