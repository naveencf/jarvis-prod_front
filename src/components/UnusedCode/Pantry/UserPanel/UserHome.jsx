import { useState } from "react";
import UserNav from "./UserNav";
import UserProducts from "./UserProducts";
import UserSidebar from "./UserSidebar";  

const UserHome = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sitting, setsitting] = useState("");

  const handleCartItems = (updatedCart) => {
    setCartItems(updatedCart);
  };

  const handleSitting = (sittingData) => {
    setsitting(sittingData);
  };
  const handleCartAddition = (newProduct) => {
    const newProAdd = cartItems.includes(newProduct);

    !newProAdd
      ? setCartItems((prevCartItems) => [...prevCartItems, newProduct])
      : cartItems;
  };

  return (
    <>
      <UserNav />
      <UserProducts
        handleCartAddition={handleCartAddition}
        cartItems={cartItems}
        handleSitting={handleSitting}
      />
      <UserSidebar
        cartItems={cartItems}
        updatedCart={handleCartItems}
        selectedSitting={sitting}
      />
    </>
  );
};

export default UserHome;
