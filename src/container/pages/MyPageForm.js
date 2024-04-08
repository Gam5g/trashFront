import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";

function MyPageForm() {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인한 회원만 볼 수 있습니다.");
      navigate("/");
    }
  }, [isLoggedIn]);

  const showMyPage = () => {};
}

export default MyPageForm;
