import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { LuUserSquare2 } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";

const FindPassword = () => {
  const {
    register,
    //formState: { isSubmitting, errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("../login");
  };
  return (
    <div>
      <h2>비밀번호 찾기</h2>
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
      <div className="inputWrap">
        <MdAlternateEmail style={{ height: "30px" }} />
        <input
          type="text"
          name="email"
          className="inputContent"
          placeholder="이메일"
          {...register("email", {
            required: "이메일을 입력하세요.",
          })}
        />
      </div>
      <button className="loginbutton" onClick={navigateToLogin}>
        인증번호 전송
      </button>
      <div></div>
      <button className="loginbutton" onClick={navigateToLogin}>
        비밀번호 찾기
      </button>
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
      <Link to="/api/auth/sign-in" style={{ color: "gray" }}>
        로그인
      </Link>
    </div>
  );
};

export default FindPassword;
