import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthToken from "./AuthToken";

const WithdrawalForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async () => {
    const { confirmation } = getValues();
    if (confirmation !== "탈퇴합니다") {
      setBackendError("정확한 문구를 입력해야 탈퇴가 가능합니다.");
      return;
    }

    try {
      const accesstoken = localStorage.getItem("accessToken");
      const refreshtoken = localStorage.getItem("RefreshToken");
      await AuthToken.delete("http://3.39.190.90/api/account/withdrawal", {
        data: {
          accesstoken,
          refreshtoken,
        },
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      setBackendError("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
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
        <button type="submit">탈퇴하기</button>
      </form>
    </div>
  );
};

export default WithdrawalForm;
