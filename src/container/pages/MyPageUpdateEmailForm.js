import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthToken from "./AuthToken";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./MyPageUpdateForm.css";

const MyPageUpdateEmailForm = () => {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const userId = localStorage.getItem("currentUserId");
  const [account, setAccount] = useState({
    email: localStorage.getItem("email") || "",
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const navigate = useNavigate();
  const [checkEmail, setCheckEmail] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      userId: 0,
    },
  });

  const checkDuplicate = async (value, type) => {
    if (type === "email" && errors.email) {
      alert("이메일 형식이 올바르지 않습니다.");
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
        if (localStorage.getItem("nickname") === value)
          alert("본인의 현재 닉네임입니다.");
        else if (result === `사용가능한 이메일 입니다.`) {
          alert("사용가능한 이메일입니다.");
          setCheckEmail(true);
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await AuthToken.get(`/account/me`, {
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
  }, [cookies.accessToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AuthToken.put(
        `/account/me`,
        {
          email: account.email,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      alert("정보가 성공적으로 수정되었습니다.");
      localStorage.setItem("email", account.email);
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
    <div className="myPage">
      <h1 className="my-page-update-text">이메일 변경</h1>

      <form onSubmit={handleUpdate}>
        <p className="my-page-type">이메일</p>
        <div className="form-group">
          <input
            className="my-page-update-input"
            type="email"
            {...register("email", { required: true })}
            defaultValue={account.email}
          />
          <div className="my-page-text">
            현재 이메일 : {localStorage.getItem("email")}
          </div>
        </div>
        <button
          className="my-page-duplicate-button"
          type="button"
          onClick={() => {
            const emailValue = watch("email");
            checkDuplicate(emailValue, "email");
          }}
        >
          이메일 중복확인
        </button>
        <div className="my-page-button-container">
          <button type="submit" className="my-page-update-button">
            수정
          </button>
          <button
            type="button"
            onClick={navigateToMyPage}
            className="my-page-cancel-button"
          >
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyPageUpdateEmailForm;
