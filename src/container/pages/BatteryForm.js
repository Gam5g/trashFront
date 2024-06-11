import React from "react";
import MapForm from "../../components/MapForm";
import BatteryMap from "./BatteryMap";

const BatteryForm = () => {
  return (
    <MapForm
      MapComponent={BatteryMap}
      primaryTitle="폐건전지/폐형광등 수거함"
      secondaryTitle="폐의약품 수거함"
      primaryPath="/battery"
      secondaryPath="/medicine"
    />
  );
};

export default BatteryForm;
