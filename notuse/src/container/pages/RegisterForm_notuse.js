import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useForm } from "react-hook-form";
import "../../App.css";
//https://velog.io/@easyhyun00/Spring-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-Spring-React-DB-%EC%97%B0%EA%B2%B0
// 스프링-리액트-DB 연동

// 비밀번호 확인 버그 있음
const RegisterForm = () => {
  const [form, setForm] = useState({
    id: "",
    password: "",
    passwordconfirm: "",
    nickname: "",
    region: "",
    subregion: "",
  });

  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  //const [phoneError, setPhoneError] = useState("");
  const [regionError, setRegionError] = useState("");
  const [subregionError, setSubregionError] = useState("");

  const [isIdCheck, setIsIdCheck] = useState(false); // 아이디 체크
  const [isIdAvailable, setIsIdAvailable] = useState(false); // 아이디 존재하는지 여부
  const [isPasswordCheck, setIsPasswordCheck] = useState(false); // 패스워드 체크
  const [isPasswordAvailable, setIsPasswordAvailable] = useState(false); // 전화번호 체크
  const [isPasswordConfirmAvailable, setIsPasswordConfirmAvailable] =
    useState(false); // 전화번호 체크
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); // 닉네임 체크
  //const [isPhoneAvailable, setIsPhoneAvailable] = useState(false); // 전화번호 체크
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedSubregion, setSelectedSubregion] = useState("");
  const [passwordVisible, setPasswordVisible] = useState("");
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState("");

  const navigate = useNavigate();

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

  const onChangeIdHandler = (e) => {
    const newId = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      id: newId,
    }));
    idCheckHandler(form.id);
  };

  const onChangePasswordHandler = (e) => {
    const newPassword = e.target.value;
    setForm({
      ...form,
      password: newPassword,
    });
    passwordCheckHandler(form.password);
  };

  const onChangePasswordConfirmHandler = (e) => {
    const newPasswordConfirm = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      passwordconfirm: newPasswordConfirm,
    }));
    passwordCheckHandler(form.password, newPasswordConfirm);
  };

  const onChangeNicknameHandler = (e) => {
    const newNickname = e.target.value;
    setForm({
      ...form,
      nickname: newNickname,
    });
    nicknameCheckHandler(newNickname);
  };

  /*const onChangePhoneHandler = (e) => {
    setForm({
      ...form,
      phone: e.target.value,
    });
    phoneCheckHandler(form.phone);
  };*/

  const onChangeRegionHandler = (e) => {
    setSelectedRegion(e.target.value);
    setForm({ ...form, region: e.target.value });
    regionCheckHandler(e.target.value);
    setSelectedSubregion("");
  };

  const onChangeSubregionHandler = (e) => {
    setSelectedSubregion(e.target.value);
    setForm({ ...form, subregion: e.target.value });
    subregionCheckHandler(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const NavigateToLogin = () => {
    navigate("../login");
  };

  const idCheckHandler = (id) => {
    const idlist = /^[a-zA-z0-9]{5,12}$/;
    if (id === "") {
      setIdError("아이디를 입력해주세요.");
      setIsIdAvailable(false);
      return false;
    } else if (!idlist.test(id)) {
      setIdError("아이디로는 6~12자만 가능합니다.");
      setIsIdAvailable(false);
      return false;
    } else {
      setIdError("사용 가능한 아이디입니다.");
      setIsIdAvailable(true);
      return true;
    }
  };

  useEffect(() => {
    passwordCheckHandler(form.password, form.passwordconfirm);
  }, [form.password, form.passwordconfirm]);

  const passwordCheckHandler = (password, passwordconfirm) => {
    const passwordlist = /^(?=.*[a-zA-Z!@#$%^*+=-[0-9]).{7,15}$/;
    if (password === "") {
      setPasswordError("비밀번호를 입력해주세요.");
      setIsPasswordAvailable(false);
      return false;
    } else if (!passwordlist.test(password)) {
      setPasswordError("비밀번호는 8~15자만 가능합니다. ");
      setIsPasswordAvailable(false);
      return false;
    } else if (password !== passwordconfirm) {
      // setPasswordError("");
      // setPasswordConfirmError("비밀번호가 일치하지 않습니다. ");
      setPasswordError(password);
      setPasswordConfirmError(passwordconfirm);
      setIsPasswordAvailable(true);
      setIsPasswordConfirmAvailable(false);
      return false;
    } else {
      setPasswordError("사용 가능한 비밀번호입니다.");
      // setPasswordConfirmError("비밀번호가 일치합니다.");
      setPasswordConfirmError(passwordconfirm);
      setIsPasswordAvailable(true);
      setIsPasswordConfirmAvailable(true);
      return true;
    }
  };

  /*const phoneCheckHandler = (phone) => {
    const phonelist = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (phone === "") {
      setPhoneError("휴대전화 번호를 입력해주세요.");
      setIsPhoneAvailable(false);
      return false;
    } else if (!phonelist.test(phone)) {
      setPhoneError("잘못된 휴대전화 번호입니다.");
      setIsPhoneAvailable(false);
      return false;
    } else {
      setPhoneError("");
      setIsPhoneAvailable(true);
      return true;
    }
  };*/

  const regionCheckHandler = (region) => {
    if (region === "") {
      setRegionError("지역을 선택해주세요.");
      return false;
    } else {
      setRegionError("");
      return true;
    }
  };

  const subregionCheckHandler = (subregion) => {
    if (subregion === "") {
      setSubregionError("시/군/구를 선택해주세요.");
      return false;
    } else {
      setSubregionError("");
      return true;
    }
  };

  const nicknameCheckHandler = (nickname) => {
    const nicknamelist = /^[a-zA-Z가-힣0-9]{2,8}$/; // 영어 또는 한글, 숫자로만 이루어진 최대 8자 닉네임
    if (nickname === "") {
      setNicknameError("닉네임을 입력해주세요.");
      setIsNicknameAvailable(false);
      return false;
    }
    if (!nicknamelist.test(nickname)) {
      setNicknameError("닉네임은 한글 또는 영어, 숫자로 2~8자만 가능합니다.");
      setIsNicknameAvailable(false);
      return false;
    } else {
      setNicknameError("사용 가능한 닉네임입니다.");
      setIsNicknameAvailable(true);
      return true;
    }
  };

  const onSubmitHandler = () => {
    setIdError("");
    setPasswordError("");
    setNicknameError("");
    setRegionError("");
    setSubregionError("");
    setIsSubmitted(false);

    const isIdCheck = idCheckHandler(form.id);
    const isPasswordCheck = passwordCheckHandler(form.password);
    const isNicknameCheck = nicknameCheckHandler(form.nickname);
    //const isPhoneCheck = phoneCheckHandler(form.phone);

    if (!isIdAvailable || !isIdCheck) {
      console.log("아이디 중복 검사 실패");
      return;
    } else if (!isNicknameCheck) {
      console.log("닉네임 중복 검사 실패");
      return;
    }
    if (isPasswordCheck) {
      console.log("비밀번호 검사 완료");
    } else return;

    axios
      .post("http://3.39.190.90/api/auth/sign-up", {
        id: form.id,
        password: form.password,
        nickname: form.nickname,
        region: form.region,
        subregion: form.subregion,
      })
      .then((res) => {
        alert("회원가입 성공");
        setIsSubmitted(true);
        if (res.status === 200) {
          navigate("../login");
        }
        //localStorage.setItem('token', response.data.jwt);  // 받아온 정보로 바로 로그인하기
      })
      .catch(function (err) {
        alert("error는 " + err);
      });
  };

  return (
    <>
      <div className="titleWrap"> 회원가입 </div>
      <div>
        <div className="contentWrap">
          <div className="inputTitle">아이디</div>
          <input
            onChange={onChangeIdHandler}
            type="text"
            id="id"
            name="id"
            value={form.id}
            placeholder="아이디"
            maxLength={12}
            className="inputWrap"
          />
          {idError && (
            <div className={isIdAvailable ? "Available" : "message"}>
              {idError}
            </div>
          )}
          <div className="inputTitle">비밀번호 입력</div>
          <input
            onChange={onChangePasswordHandler}
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            value={form.password}
            placeholder="비밀번호 입력"
            maxLength={15}
            className="inputWrap"
          />
          <div onClick={togglePasswordVisibility}>
            {passwordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </div>
          {passwordError && (
            <div className={isPasswordAvailable ? "Available" : "message"}>
              {passwordError}
            </div>
          )}
          <div className="inputTitle">비밀번호 확인</div>
          <input
            onChange={onChangePasswordConfirmHandler}
            type={passwordConfirmVisible ? "text" : "password"}
            id="passwordconfirm"
            name="passwordconfirm"
            value={form.passwordconfirm}
            placeholder="비밀번호 확인"
            maxLength={15}
            className="inputWrap"
          />
          <div onClick={togglePasswordConfirmVisibility}>
            {passwordConfirmVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </div>
          {passwordConfirmError && (
            <div
              className={isPasswordConfirmAvailable ? "Available" : "message"}
            >
              {passwordConfirmError}
            </div>
          )}
        </div>
        <div className="inputTitle">닉네임</div>
        <input
          onChange={onChangeNicknameHandler}
          type="text"
          id="nickname"
          name="nickname"
          value={form.nickname}
          placeholder="닉네임"
          maxLength={8}
          className="inputWrap"
        />
        {nicknameError && (
          <div className={isNicknameAvailable ? "Available" : "message"}>
            {nicknameError}
          </div>
        )}
        <div></div>
        <div className="inputTitle">지역</div>
        <select
          id="region"
          name="region"
          value={selectedRegion}
          onChange={onChangeRegionHandler}
        >
          <option value="">지역 선택</option>
          {regions.map((region, index) => (
            <option key={index} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
        {regionError && (
          <div className={selectedRegion ? "Available" : "message"}>
            {regionError}
          </div>
        )}
        <div></div>
        {selectedRegion && (
          <>
            <div className="inputTitle">시군구</div>
            <select
              id="subRegion"
              name="subRegion"
              value={selectedSubregion}
              onChange={onChangeSubregionHandler}
            >
              <option value="">시군구 선택</option>
              {regions
                .find((item) => item.name === selectedRegion)
                .subRegions.map((subregion, index) => (
                  <option key={index} value={subregion}>
                    {subregion}
                  </option>
                ))}
            </select>
            {subregionError && (
              <div className={selectedSubregion ? "Available" : "message"}>
                {subregionError}
              </div>
            )}
          </>
        )}

        <div></div>
        <button className="loginbutton" onClick={NavigateToLogin}>
          로그인
        </button>
        <button className="registerbutton" onClick={onSubmitHandler}>
          회원가입
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
