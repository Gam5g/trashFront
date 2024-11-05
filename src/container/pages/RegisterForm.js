import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthToken from "./AuthToken";
import "./RegisterForm.css";
import "../../App.css";

const RegisterForm = () => {
  const [checkID, setCheckID] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [checkNickname, setCheckNickname] = useState(false);

  const {
    register,
    watch,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userId: 0,
    },
  });

  const onSubmit = () => {
    const formData = {
      id: watch("id"),
      password: watch("password"),
      password_confirm: watch("password_confirm"),
      email: watch("email"),
      nickname: watch("nickname"),
      region: watch("region"),
      subRegion: watch("subRegion"),
    };
    const idPattern = /^[a-zA-Z0-9-_]+$/;
    if (!watch("id")) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (!idPattern.test(formData.id)) {
      alert("아이디 형식에 맞지 않습니다.");
      return;
    }
    if (formData.id.length < 5) {
      alert("아이디는 최소 5글자입니다.");
      return;
    }
    if (formData.id.length > 12) {
      alert("아이디는 최대 12글자입니다.");
      return;
    }
    if (formData.id === "admin") {
      alert("불가능한 아이디입니다.");
      return;
    }
    if (!checkID) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-])[a-zA-Z0-9!@#$%^*+=-]+$/;
    if (!formData.password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (!passwordPattern.test(formData.password)) {
      alert("비밀번호는 알파벳과 숫자, 특수기호를 포함해야 합니다.");
      return;
    }
    if (formData.password.length < 8) {
      alert("비밀번호는 최소 8글자입니다.");
      return;
    }
    if (formData.password.length > 15) {
      alert("비밀번호는 최대 15글자입니다.");
      return;
    }
    if (!formData.password_confirm) {
      alert("비밀번호 확인란을 입력해주세요.");
      return;
    }
    if (formData.password !== formData.password_confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!emailPattern.test(formData.email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (!checkEmail) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }
    const nicknamePattern = /^[A-Za-z0-9가-힣]+$/;
    if (!formData.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!nicknamePattern.test(formData.nickname)) {
      alert("닉네임 형식에 맞지 않습니다.");
      return;
    }
    if (formData.nickname.length < 2) {
      alert("닉네임은 최소 2글자입니다.");
      return;
    }
    if (formData.nickname.length > 8) {
      alert("닉네임은 최대 8글자입니다.");
      return;
    }
    if (!checkNickname) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }
    if (!watch("region") && !agreed) {
      alert("지역을 선택해주세요.");
      return;
    }
    if (!watch("subRegion") && !agreed) {
      alert("시군구를 선택해주세요.");
      return;
    }
    if (agreed) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          submitForm(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          submitForm();
        },
        { enableHighAccuracy: true }
      );
    } else {
      submitForm();
    }
  };

  const checkDuplicate = async (value, type) => {
    if (type === "email" && errors.email) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (type === "id" && errors.id) {
      alert("아이디 형식이 올바르지 않습니다.");
      return;
    }
    if (type === "nickname" && errors.nickname) {
      alert("닉네임 형식이 올바르지 않습니다.");
      return;
    }
    const url = `/account/duplicate-test/${type}`;
    await AuthToken.post(
      url,
      {
        duplicate: value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((result) => {
        alert(result);
        if (
          result ===
          `사용가능한 ${type === "id" ? "아이디" : type === "nickname" ? "닉네임" : "이메일"} 입니다.`
        ) {
          if (type === "id") {
            setCheckID(true);
          } else if (type === "nickname") {
            setCheckNickname(true);
          } else {
            setCheckEmail(true);
          }
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  const submitForm = async (latitude = null, longitude = null) => {
    const formData = {
      id: watch("id"),
      password: watch("password"),
      email: watch("email"),
      nickname: watch("nickname"),
      region: watch("region"),
      latitude,
      longitude,
    };
    await AuthToken.post(
      "/auth/sign-up",
      {
        accountName: formData.id,
        password: formData.password,
        email: formData.email,
        nickname: formData.nickname,
        region: formData.region,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((result) => {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        console.log("결과:", result);
        navigate("../sign-in");
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  const password = useRef({});
  password.current = watch("password", "");

  const regions = [
    {
      name: "대구",
      subRegions: [
        "남구",
        "달서구",
        "달성군",
        "동구",
        "북구",
        "서구",
        "수성구",
        "중구",
      ],
    },
  ];
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  //const [position, setPosition] = useState(null);

  const navigate = useNavigate();

  const NavigateToMain = () => {
    navigate("../");
  };

  return (
    <div className="register-content-box">
      <div className="register-title-wrap"> 회원가입 </div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="register-tag">아이디</p>
          <input
            type="text"
            name="id"
            className="register-input-content"
            placeholder="아이디"
            {...register("id")}
          />
          <button
            type="button"
            className="register-duplicate-button"
            onClick={() => checkDuplicate(watch("id"), "id")}
          >
            아이디 중복확인
          </button>
          <p className="register-tag">비밀번호</p>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            className="register-input-content"
            placeholder="비밀번호"
            {...register("password")}
          />
          <input
            type={passwordConfirmVisible ? "text" : "password"}
            name="password_confirm"
            className="register-input-content"
            placeholder="비밀번호 확인"
            {...register("password_confirm")}
          />
          <p className="register-rule">
            비밀번호는 최소 8자, 최대 15자로 구성되어야 합니다.
          </p>
          <p className="register-rule">
            비밀번호는 알파벳, 숫자, 특수문자로 구성되어야 합니다.
          </p>
          <p className="register-tag">이메일</p>
          <input
            type="text"
            name="email"
            className="register-input-content"
            placeholder="이메일"
            {...register("email")}
          />
          <button
            type="button"
            className="register-duplicate-button"
            onClick={() => checkDuplicate(watch("email"), "email")}
          >
            이메일 중복확인
          </button>
          <p className="register-tag">닉네임</p>
          <input
            type="text"
            name="nickname"
            className="register-input-content"
            placeholder="닉네임"
            {...register("nickname")}
          />
          <button
            type="button"
            className="register-duplicate-button"
            onClick={() => checkDuplicate(watch("nickname"), "nickname")}
          >
            닉네임 중복확인
          </button>
          <div className="agree-label">
            <label for="agree">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                onChange={(e) => setAgreed(e.target.checked)}
              />
              위치확인 동의
            </label>
          </div>
          {!agreed && (
            <div className="register-region-container">
              <select
                className="register-region-select"
                {...register("region")}
              >
                <option value="">지역 선택</option>
                {regions.map((region, index) => (
                  <option key={index} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
              {watch("region") && (
                <>
                  <select
                    id="subRegion"
                    name="subRegion"
                    className="register-region-select"
                    {...register("subRegion")}
                  >
                    <option value="">시군구 선택</option>
                    {regions
                      .find((item) => item.name === watch("region"))
                      .subRegions.map((subregion, index) => (
                        <option key={index} value={subregion}>
                          {subregion}
                        </option>
                      ))}
                  </select>
                </>
              )}
            </div>
          )}
        </div>
        <div className="register-button-container">
          <button
            className="register-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            완료
          </button>
          <button className="register-cancel-button" onClick={NavigateToMain}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
