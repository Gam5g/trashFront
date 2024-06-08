import React from "react";
import { Background } from "./LoadingStyles";
import Spinner from "../../Spinner.gif";

export default () => {
  return (
    <Background>
      <img src={Spinner} alt="로딩중" width="50%" />
    </Background>
  );
};
