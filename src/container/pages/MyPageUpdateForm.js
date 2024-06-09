import React, { useEffect, useState } from "react";
import AuthToken from "./AuthToken";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./MyPageForm.css";

const MyPageUpdateForm = () => {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const userId = localStorage.getItem("currentUserId");
  const [account, setAccount] = useState({
    email: localStorage.getItem("email") || "",
    nickname: localStorage.getItem("nickname") || "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await AuthToken.get(`/account/me?id=${userId}`, {
          headers: {
            Authorization: cookies.accessToken,
          },
        });
        setAccount(response.data);
      } catch (error) {
        console.error("계정 정보를 가져오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountData();
  }, [userId, cookies.accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AuthToken.put(
        `/account/me?id=${userId}`,
        {
          email: account.email,
          nickname: account.nickname,
          latitude: account.latitude,
          longitude: account.longitude,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      alert("정보가 성공적으로 수정되었습니다.");
      localStorage.setItem("email", account.email);
      localStorage.setItem("nickname", account.nickname);
      navigate("/my-page");
    } catch (error) {
      console.error("error : ", error);
    }
  };

  const navigateToMyPage = () => {
    navigate("/my-page");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="myPage" style={{ userSelect: "none" }}>
      <h1 style={{ textAlign: "center" }}>정보 수정 페이지</h1>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label style={{ marginBottom: "15px" }}>이메일</label>
          <input
            className="page-inputContent"
            type="email"
            name="email"
            value={account.email}
            onChange={handleChange}
            style={{ marginBottom: "15px" }}
          />
          <div style={{ marginBottom: "15px" }}>
            현재 이메일 : {localStorage.getItem("email")}
          </div>
        </div>
        <div className="form-group">
          <label style={{ marginBottom: "15px" }}>닉네임</label>
          <input
            className="page-inputContent"
            type="text"
            name="nickname"
            value={account.nickname}
            disabled={isAdmin}
            onChange={handleChange}
            style={{ marginBottom: "15px" }}
          />
          <div style={{ marginBottom: "15px" }}>
            현재 닉네임 : {localStorage.getItem("nickname")}
          </div>
        </div>
        <div className="form-group">
          <div style={{ marginBottom: "15px" }}>
            현재 위도 : {account.latitude}
          </div>
        </div>
        <div className="form-group">
          <div style={{ marginBottom: "15px" }}>
            현재 경도 : {account.longitude}
          </div>
        </div>
        <div className="button-container">
          <button type="submit" className="submitbutton">
            수정
          </button>
          <button
            type="button"
            onClick={navigateToMyPage}
            className="cancelbutton"
          >
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyPageUpdateForm;
