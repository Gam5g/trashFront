import React from "react";
import MapForm from "../../components/MapForm";
import MedicineMap from "./MedicineMap";

const MedicineForm = () => {
  return (
    <MapForm
      MapComponent={MedicineMap}
      primaryTitle="폐의약품 수거함"
      secondaryTitle="폐건전지/폐형광등 수거함"
      primaryPath="/medicine"
      secondaryPath="/battery"
    />
  );
};

export default MedicineForm;
