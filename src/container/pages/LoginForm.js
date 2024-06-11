import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { LuUserSquare2 } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { useCookies, Cookies } from "react-cookie";
import "../../App.css";
import "../../Button.css";
import AuthToken from "./AuthToken";
import { isLoggedInState } from "../../state/authState";

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["accessToken, RefreshToken"]);
  const { state } = useLocation();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async () => {
    const formData = {
      id: watch("id"),
      password: watch("password"),
    };
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
            //credentials: "include",
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
      //setCookie("accessToken", accessToken, { path: "/" });

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
    <div className="NotDrag">
      <div className="titleWrap"> 로그인 </div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="contentWrap">
          <div className="inputWrap">
            <LuUserSquare2 style={{ height: "30px" }} />
            <input
              type="text"
              name="id"
              className="inputContent"
              placeholder="아이디"
              {...register("id", {
                required: "아이디를 입력하세요.",
              })}
            />
          </div>
          <p style={{ color: "red" }}>{errors.id?.message}</p>
          <div className="inputWrap">
            <RiLockPasswordLine style={{ height: "30px" }} />
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className="inputContent"
              placeholder="비밀번호"
              {...register("password", {
                required: "비밀번호를 입력하세요.",
              })}
            />
            <div onClick={togglePasswordVisibility}>
              {passwordVisible ? (
                <AiFillEye style={{ height: "30px", cursor: "pointer" }} />
              ) : (
                <AiFillEyeInvisible
                  style={{ height: "30px", cursor: "pointer" }}
                />
              )}
            </div>
          </div>
          <p style={{ color: "red" }}>{errors.password?.message}</p>
          <div className="login-container">
            <button
              className="write-green-button"
              type="submit"
              style={{ width: "360px" }}
              disabled={isLoading}
            >
              로그인
            </button>
          </div>
          <div></div>
          <Link
            to="/find-id"
            style={{
              color: "gray",
              margin: "20px 10px 0",
            }}
          >
            아이디 찾기
          </Link>
          <Link
            to="/find-password"
            style={{
              color: "gray",
              margin: "20px 10px 0",
            }}
          >
            비밀번호 찾기
          </Link>
          <Link
            to="../sign-up"
            style={{
              color: "gray",
              margin: "20px 10px 0",
            }}
          >
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
