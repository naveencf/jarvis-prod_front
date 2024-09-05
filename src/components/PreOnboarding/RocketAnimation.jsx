import React, { useRef, useEffect } from "react";
import Modal from "react-modal";

const RocketAnimation = ({
  isShowRocket,
  closeRocket,
  videoLink,
  audioLink,
}) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const startVideoAndSound = () => {
    if (audioRef.current && videoRef.current) {
      videoRef.current.play();
      audioRef.current.play();
    }
  };

  const stopVideoAndSound = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.pause();
      videoRef.current.pause();
      audioRef.current.currentTime = 0;
      videoRef.current.currentTime = 0;
    }
    closeRocket();
  };

  useEffect(() => {
    if (isShowRocket) {
      startVideoAndSound();
    }
  }, [isShowRocket]);

  return (
    <Modal
      className="loaderRocket"
      isOpen={isShowRocket}
      onRequestClose={stopVideoAndSound}
      contentLabel="Rocket Modal"
      appElement={document.getElementById("root")}
      shouldCloseOnOverlayClick={false}
    >
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        autoPlay
        playsInline
        muted
        loop
        onEnded={stopVideoAndSound}
      >
        <source src={videoLink} type="video/mp4" />
      </video>
      <audio ref={audioRef} onEnded={stopVideoAndSound}>
        <source src={audioLink} type="audio/mpeg" />
      </audio>
    </Modal>
  );
};

export default RocketAnimation;
