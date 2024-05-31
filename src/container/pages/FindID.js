import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { VscCopilot } from "react-icons/vsc";
import axios from "axios";

const FindID = () => {
  const {
    register,
    //formState: { isSubmitting, errors },
    watch,
    handleSubmit,
  } = useForm({ mode: "onChange" });
  //const navigate = useNavigate();

  const onSubmit = () => {
    const formData = {
      nickname: watch("nickname"),
      email: watch("email"),
    };
    axios
      .post(
        "http://3.39.190.90/api/auth/sign-up",
        {
          nickname: formData.nickname,
          email: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const { email, userId } = response.data;
          alert(`사용자의 이메일은 ${email} 이고 아이디는 ${userId} 입니다.`);
        } else {
          alert("서버 요청 중 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("에러:", error);
        console.log(formData.nickname);

        alert("서버 요청 중 오류가 발생했습니다.");
      });
  };

  /*const navigateToLogin = () => {
    navigate("../api/auth/sign-in");
  };*/
  return (
    <div>
      <h2>아이디 찾기</h2>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="inputWrap">
          <MdAlternateEmail style={{ height: "30px" }} />
          <input
            type="text"
            name="email"
            className="inputContent"
            placeholder="이메일"
            {...register("email", {
              required: "이메일은 필수 입력입니다.",
            })}
          />
        </div>
        <div className="inputWrap">
          <VscCopilot style={{ height: "30px" }} />
          <input
            type="text"
            name="nickname"
            className="inputContent"
            placeholder="닉네임"
            {...register("nickname", {
              required: "닉네임을 입력하세요.",
            })}
          />
        </div>

        <button
          className="write-green-button"
          style={{ width: "160px", marginTop: "10px" }}
          onClick={handleSubmit}
        >
          아이디 찾기
        </button>
        <div></div>
        <div></div>
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
          to="/api/auth/sign-in"
          style={{
            color: "gray",
            margin: "20px 10px 0",
          }}
        >
          로그인
        </Link>
      </form>
    </div>
  );
};

export default FindID;
