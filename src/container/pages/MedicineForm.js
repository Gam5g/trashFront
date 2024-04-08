import React from "react";
import MedicineMap from "./MedicineMap";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";

const MedicineForm = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  return (
    isLoggedIn && (
      <div>
        <h2>대구시의 폐의약품 수거함 위치</h2>
        <MedicineMap />
      </div>
    )
  );
};
export default MedicineForm;
