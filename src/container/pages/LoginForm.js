import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import "./LoginForm.css";
import AuthToken from "./AuthToken";
import { isLoggedInState } from "../../state/authState";

const LoginForm = () => {
  const { watch, handleSubmit, register } = useForm({
    mode: "onChange",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["accessToken, RefreshToken"]);
  const { state } = useLocation();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = data;
    console.log("Form Data:", formData);
    if (!formData.id) {
      alert("아이디를 입력하세요.");
      return;
    }

    if (!formData.password) {
      alert("비밀번호를 입력하세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await AuthToken.post(
        "/auth/sign-in",
        {
          accountName: formData.id,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const accessToken = response.headers["authorization"];
      const refreshToken = cookies.RefreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("accountName", formData.id);

      alert("로그인되었습니다. 환영합니다!");
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      setIsLoggedIn(true);
      if (state) {
        navigate(state);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 403) {
        alert("회원정보가 일치하지 않습니다.");
        console.error("회원정보가 일치하지 않습니다.");
      } else {
        console.error("네트워크 응답이 올바르지 않습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-content-box">
      <div className="login-title-wrap"> 로그인 </div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            name="id"
            className="login-input-content"
            placeholder="ID"
            {...register("id")}
          />
          <div className="input-wrap">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className="login-input-content"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <div className="sign-in-container">
            <button
              className="sign-in-button"
              type="submit"
              disabled={isLoading}
            >
              로그인
            </button>
          </div>
          <div></div>
          <Link to="../sign-up" className="register-link-button">
            아직 회원이 아니신가요? 회원가입
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
