import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAuthDispatch } from "../../AuthContext";

const LogoutForm = () => {
  const [removeCookie] = useCookies(["access"]);
  const dispatch = useAuthDispatch();
  useEffect(() => {
    const tokenlogout = async () => {
      localStorage.removeItem("access");
      removeCookie("access");
      dispatch({ type: "LOGOUT" });
      console.log("로그아웃 성공");
    };
    tokenlogout().catch((error) => {
      console.error("로그아웃 실패:", error);
    });
  }, []);
  return <p>로그아웃 중입니다</p>;
};

export default LogoutForm;
