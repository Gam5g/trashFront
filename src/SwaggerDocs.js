import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerDocs = () => {
  return (
    <div>
      <SwaggerUI url="http://54.180.237.99:8080/swagger-ui/index.html" />
    </div>
  );
};

export default SwaggerDocs;
