import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";
import "./MyPageForm.css";
import { useCookies } from "react-cookie";

function MyPageForm() {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie] = useCookies(["accessToken"]);

  const navigateToOut = () => {
    navigate("/api/account/withdrawal");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    } else {
      (async () => {
        try {
          const response = await AuthToken.get(
            `http://3.39.190.90/api/account/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
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

  const onUpdate = async () => {
    navigate("/my-page/update");
  };

  const navigateToList = () => {
    navigate("list");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  /*if (loading) {
    return <div className="loading">Loading...</div>;
  }*/

  return (
    <div className="myPage">
      <h2>내 정보</h2>
      {account ? (
        <div className="accountInfo">
          <ul>
            <li>아이디: {account.accountName}</li>
            <li>이메일: {account.email}</li>
            <li>닉네임: {account.nickname}</li>
            <li>경도: {account.latitude}</li>
            <li>위도: {account.longitude}</li>
          </ul>
          <button
            className="withdrawal-button"
            onClick={navigateToOut}
            style={{ marginBottom: "15px" }}
          >
            회원 탈퇴
          </button>
          <button className="info-update-button" onClick={onUpdate}>
            정보 수정
          </button>
        </div>
      ) : (
        <div>계정 정보를 찾을 수 없습니다.</div>
      )}
      <button className="info-update-button" onClick={navigateToList}>
        내 게시글 보기
      </button>
    </div>
  );
}

export default MyPageForm;
