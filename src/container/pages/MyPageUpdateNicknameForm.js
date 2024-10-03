import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthToken from "./AuthToken";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./MyPageUpdateForm.css";

const MyPageUpdateNicknameForm = () => {
  const [cookies, setCookie] = useCookies(["accessToken"]);
  const userId = localStorage.getItem("currentUserId");
  const [account, setAccount] = useState({
    nickname: localStorage.getItem("nickname") || "",
  });
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("accountName") === "admin";
  const navigate = useNavigate();
  const [checkNickname, setCheckNickname] = useState(false);

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
        if (localStorage.getItem("nickname") === value)
          alert("본인의 현재 닉네임입니다.");
        else if (result === `사용가능한 닉네임 입니다.`) {
          alert("사용가능한 닉네임입니다.");
          setCheckNickname(true);
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
          nickname: account.nickname,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      alert("정보가 성공적으로 수정되었습니다.");
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
    <div className="myPage">
      <h1 className="my-page-update-text">닉네임 변경</h1>
      <form onSubmit={handleUpdate}>
        <p className="my-page-type">닉네임</p>
        <br />
        <p className="my-page-text">
          타인에게 불쾌감을 주는 닉네임은 삼가하여 주시기 바랍니다.
        </p>
        <div className="form-group">
          <input
            className="my-page-update-input"
            type="text"
            {...register("nickname", { required: true })}
            defaultValue={account.nickname}
            disabled={isAdmin}
          />
          <p className="my-page-text">
            현재 닉네임 : {localStorage.getItem("nickname")}
          </p>
        </div>
        <button
          className="my-page-duplicate-button"
          type="button"
          onClick={() => {
            const nicknameValue = watch("nickname");
            checkDuplicate(nicknameValue, "nickname");
          }}
        >
          닉네임 중복확인
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

export default MyPageUpdateNicknameForm;
