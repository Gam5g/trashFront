import React from "react";
import MapComponent from "../../components/MapComponent";

const BatteryMap = ({ page, updateTotalItems }) => {
  return (
    <MapComponent
      endpoint="/location/lampAndBattery"
      page={page}
      updateTotalItems={updateTotalItems}
      defaultRegion="서구"
      regionButtons={[
        "서구",
        "달서구",
        "북구",
        "남구",
        "수성구",
        "달성군",
        "중구",
        "동구",
        "군위군",
      ]}
    />
  );
};

export default BatteryMap;
