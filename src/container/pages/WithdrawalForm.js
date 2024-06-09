import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../../state/authState";
import AuthToken from "./AuthToken";

const WithdrawalForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const [backendError, setBackendError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("currentUserId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  const onSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log(accessToken);
      const accessTokenObject = {
        accountId: 0,
        timeToLive: new Date().toISOString(),
      };

      await AuthToken.delete(`/account/withdrawal?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: accessTokenObject,
        withCredentials: true,
      });
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      setBackendError("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error during withdrawal:", error);
    }
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <h1>정말 탈퇴하시겠습니까?</h1>
        <h3>아래의 입력란에 "탈퇴합니다"를 작성해주세요</h3>
        <input
          type="text"
          name="confirmation"
          placeholder="탈퇴합니다"
          className="inputWrap"
          {...register("confirmation", {
            required: "이 필드는 필수입니다.",
            validate: (value) =>
              value === "탈퇴합니다" || "정확한 문구를 입력해주세요.",
          })}
        />
        <p style={{ color: "red" }}>
          {errors.confirmation?.message || backendError}
        </p>
        <button
          type="submit"
          className="write-green-button"
          style={{ width: "380px", height: "45px" }}
        >
          탈퇴하기
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;
