import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../AuthContext";
import axios from "axios";

function MyPageForm() {
  const { isLoggedIn } = useAuthState();
  const navigate = useNavigate();

  /* useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    }
  }, [isLoggedIn]); */

  const showMyPage = () => {};
}

export default MyPageForm;
