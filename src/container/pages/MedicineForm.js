import React, { useState, useEffect } from "react";
import MedicineMap from "./MedicineMap";
import MedicineAgreedMap from "./MedicineAgreedMap";
import AuthToken from "./AuthToken";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../state/authState";

const MedicineForm = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [account, setAccount] = useState([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await AuthToken.get(
          "http://3.39.190.90/api/account/list"
        );
        const accountName = localStorage.getItem("accountName");
        const matchingAccount = response.data.find(
          (account) => account.accountName === accountName
        );
        if (matchingAccount) setAccount(matchingAccount);
      } catch (error) {
        console.error("Failed to fetch account information", error);
      }
    };

    fetchAccount();
  }, []);
  const latitude = account.latitude;
  const longitude = account.longitude;
  console.log(latitude);
  return isLoggedIn && latitude && longitude ? (
    <div>
      <h2>현재 위치에 따른 폐의약품 수거함 위치</h2>
      <MedicineAgreedMap />
    </div>
  ) : (
    <div>
      <h2>대구시의 폐의약품 수거함 위치</h2>
      <MedicineMap />
    </div>
  );
};
export default MedicineForm;
