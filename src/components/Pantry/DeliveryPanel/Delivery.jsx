import { Route, Routes } from "react-router-dom";
import DeliveryHome from "./DeliveryHome";

const Delivery = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DeliveryHome />}>
          <Route path="/delivery-data" element={<DeliveryHome />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Delivery;
