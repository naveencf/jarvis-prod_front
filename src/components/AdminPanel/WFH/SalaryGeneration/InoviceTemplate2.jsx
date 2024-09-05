// InvoiceTemplate2.js
import React from "react";

const InvoiceTemplate2 = ({ data }) => {
  return (
    <div>
      <h1>Invoice Template 2</h1>
      <p>ID: {data.id}</p>
      <p>Name: {data.name}</p>
      <p>Description: {data.description}</p>
      {/* Other content for Invoice Template 2 */}
    </div>
  );
};

export default InvoiceTemplate2;
