import React from "react";
import MedicineMap from "./MedicineMap";
import { useAuthState } from "../../AuthContext";

const MedicineForm = () => {
  const { isLoggedIn } = useAuthState();
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
