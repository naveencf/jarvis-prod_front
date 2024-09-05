import React from "react";

const ReadyToOnboardContent = ({ handleIamReady, closeModal,username }) => {
  return (
    <>
      <h2>Welcome</h2>
      <p>
        Hey <b>{username}</b>, <br/> a new star! 🌟 As you log in to your dashboard today,
        remember that you're not just joining a team; you're joining a mission
        to the creative cosmos 🌌 You've just opened the door to a world where
        creativity knows no boundaries. 
      </p>
      <button
        className="btn onboardBtn btn_secondary"
        onClick={() => {
          handleIamReady(), closeModal();
        }}
      >
        I am ready to get onboard
      </button>
    </>
  );
};

export default ReadyToOnboardContent;
