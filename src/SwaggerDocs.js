import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerDocs = () => {
  return (
    <div>
      <SwaggerUI url="https://www.bunriwiki.shop/swagger-ui/index.html" />
    </div>
  );
};

export default SwaggerDocs;
