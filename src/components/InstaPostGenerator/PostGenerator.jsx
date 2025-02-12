import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Circle,
  Path,
} from "react-konva";
import postOne from "../../assets/imgs/screenshot/post2.jpeg";
import reelOne from "../../assets/imgs/screenshot/reel1.jpg";
import sarcasmLogo from "../../assets/imgs/screenshot/sarcasm.jpg";
import muteIcon from "../../assets/imgs/screenshot/icon/mute.png";
import userIcon from "../../assets/imgs/screenshot/icon/user.png";

const PostGenerator = ({ type = "reel" }) => {
  const accNameRef = useRef(null);
  const likesRef = useRef(null);
  const stageRef = useRef(null); // Ref for the Konva stage
  const commentRef = useRef(null);
  const [image, setImage] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [muteImage, setMuteImage] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [multi, setMulti] = useState(true);
  const [multipost, setMultipost] = useState(5);
  const [width, setWidth] = useState(420);
  const [collab, setCollab] = useState(false);
  const [height, setHeight] = useState(type === "reel" ? 795.63 : 635);

  useEffect(() => {
    setWidth(420);
    if (type === "reel") {
      setHeight(795.63);
      setMulti(false);
    } else if (type === "post") {
      setHeight(multi ? 658 : 635);
    }
  }, [type, multi]);

  useEffect(() => {
    const img = new window.Image();
    img.src = sarcasmLogo; // Replace with your image URL
    img.onload = () => {
      setImage(img); // Set the image once loaded
    };
    const img1 = new window.Image();

    img1.src = type === "reel" ? reelOne : postOne;
    img1.onload = () => {
      setPostImage(img1);
    };
    const img3 = new window.Image();
    img3.src = muteIcon;
    img3.onload = () => {
      setMuteImage(img3);
    };
    const img4 = new window.Image();
    img4.src = userIcon;
    img4.onload = () => {
      setUserImage(img4);
    };
  }, []);

  const downloadImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "instagram_post.png";
    link.href = uri;
    link.click();
  };

  return (
    <>
      <div>
        {/* Konva Stage */}
        <Stage width={420} height={height} ref={stageRef}>
          <Layer>
            <Rect width={420} height={height} fill="#fff" />
            <KonvaImage
              x={0}
              y={type == "post" ? 60 : 0}
              width={width}
              height={type === "post" ? height - (multi ? 137 : 110) : 745.63}
              image={postImage}
            />
            {collab ? (
              <>
                <Circle
                  x={10 + 27.5}
                  y={30.5 - 8}
                  width={29}
                  height={29}
                  fill={type == "post" ? "#9f9f9f" : "#fff"}
                />
                <KonvaImage
                  x={10 + 15}
                  y={18 - 8}
                  width={25}
                  height={25}
                  image={image}
                  cornerRadius={50}
                />
                <Circle
                  x={0 + 27.5}
                  y={30.5 + 3}
                  width={29}
                  height={29}
                  fill={type == "post" ? "#9f9f9f" : "#fff"}
                />
                <KonvaImage
                  x={0 + 15}
                  y={18 + 3}
                  width={25}
                  height={25}
                  image={image}
                  cornerRadius={50}
                />
              </>
            ) : (
              <>
                <Circle
                  x={5 + 27.5}
                  y={30.5}
                  width={36.5}
                  height={36.5}
                  fill="#9f9f9f"
                />
                <KonvaImage
                  x={5 + 10}
                  y={13}
                  width={35}
                  height={35}
                  image={image}
                  cornerRadius={50}
                />
              </>
            )}

            {/* <Rect x={0} y={height - 50} width={width} height={50} fill="#fff" /> */}
            {/* Background */}
            {/* Text */}
            <Text
              ref={accNameRef}
              text={"sarcastic_us"}
              fontSize={15}
              fontFamily="Arial"
              x={5 + 55}
              y={16}
              width={500}
              align="start"
              fill={type == "reel" ? "#fff" : "#333"}
            />
            {/* Verififed Badge */}
            {collab && (
              <Path
                x={
                  5 +
                  (accNameRef.current ? accNameRef.current.getTextWidth() : 0) +
                  60
                } // 10px padding after text
                y={16} // Align with the text
                data="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" // Example triangle path
                fill="#0890e8"
                scale={{ x: 0.055, y: 0.055 }}
              />
            )}
            {/* music */}
            <Path
              x={5 + 55} // Position X
              y={32} // Position Y
              data="M212.92,17.71a7.89,7.89,0,0,0-6.86-1.46l-128,32A8,8,0,0,0,72,56V166.1A36,36,0,1,0,88,196V102.25l112-28V134.1A36,36,0,1,0,216,164V24A8,8,0,0,0,212.92,17.71Z"
              fill={type == "reel" ? "#fff" : "#000"} // Fill color (black by default)
              scale={{ x: 0.05, y: 0.05 }} // Scale the SVG
            />
            <Path
              x={420 - 40}
              y={20.5}
              data="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z"
              fill={type == "reel" ? "#fff" : "rgba(0, 0, 0, 0.5)"}
              scale={{ x: 0.099, y: 0.099 }}
            />
            <Text
              text="Coldplay . A Sky Full of Stars"
              fontSize={13}
              fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
              fontWeight="400"
              x={5 + 75}
              y={32}
              align="start"
              fill={type == "reel" ? "#fff" : "#515151"}
            />
            <Circle
              x={5 + 24}
              y={height - (multi ? 100 : 73)}
              fill="rgba(0, 0, 0, 0.54)"
              width={25}
              height={25}
            />
            {/* <Path
              x={5 + 24}
              y={height - 100}
              scale={{ x: 0.05, y: 0.05 }}
              data="M16 438C16 344.112 92.1116 268 186 268H326C419.888 268 496 344.112 496 438V463C496 476.807 484.807 488 471 488H41C27.1929 488 16 476.807 16 463V438Z"
              fill="#000"
            /> */}
            <Circle
              x={width - 5 - 24}
              y={height - (multi ? 100 : 73)}
              fill="rgba(0, 0, 0, 0.54)"
              width={25}
              height={25}
            />
            <KonvaImage
              image={muteImage}
              x={width - 5 - 30}
              y={height - (multi ? 106 : 79)}
              scale={{ x: 0.025, y: 0.025 }}
            />

            <KonvaImage
              image={userImage}
              x={5 + 18}
              y={height - (multi ? 107 : 80)}
              scale={{ x: 0.025, y: 0.025 }}
            />
            {/* // likes */}
            <Path
              x={10}
              y={height - 37}
              scale={{ x: 0.05, y: 0.05 }}
              fillRule="evenodd"
              clipRule="evenodd"
              data="M269.592 488.183C270.371 488.957 271.629 488.957 272.409 488.183L480.469 281.792C480.488 281.773 480.475 281.74 480.447 281.74C480.42 281.74 480.406 281.707 480.426 281.688C480.434 281.681 480.441 281.674 480.448 281.667C480.473 281.643 480.497 281.62 480.521 281.597C483.969 278.308 487.26 274.855 490.383 271.251C490.484 271.135 490.599 271.029 490.724 270.938C521.025 248.84 527 210.359 527 172.871C527 90.0996 460.246 23 377.901 23C339.568 23 304.613 37.5412 278.198 61.4357C276.234 63.2131 274.316 65.0424 272.448 66.9212C271.65 67.7228 270.35 67.7228 269.552 66.9212C267.684 65.0423 265.766 63.2131 263.801 61.4356C237.387 37.5412 202.432 23 164.099 23C81.7541 23 15 90.0996 15 172.871C15 210.361 20.4779 248.347 51.2785 270.939C51.4015 271.029 51.5156 271.134 51.6154 271.249C54.7386 274.854 58.0305 278.307 61.4787 281.597C61.5031 281.62 61.5274 281.643 61.5518 281.667C61.5591 281.674 61.5665 281.681 61.5738 281.688C61.5938 281.707 61.5803 281.74 61.5528 281.74C61.5256 281.74 61.512 281.773 61.5313 281.792L269.592 488.183ZM87.3743 292.405L89.4864 294.5L68.9818 274.014C42.3011 248.632 25.6667 212.719 25.6667 172.871C25.6667 95.9357 87.6989 33.6647 164.099 33.6647C203.009 33.6647 238.163 49.7942 263.333 75.8116L269.563 82.2509C270.349 83.0634 271.651 83.0634 272.437 82.2509L278.667 75.8116C303.837 49.7942 338.991 33.6647 377.901 33.6647C454.301 33.6647 516.333 95.9357 516.333 172.871C516.333 212.719 499.699 248.632 473.018 274.014L454.626 292.405L272.409 473.16C271.629 473.934 270.371 473.934 269.591 473.16L87.3743 292.405Z"
              fill="#000"
              stroke="#000"
              strokeWidth={25}
            />
            <Text
              ref={likesRef}
              y={height - 30}
              x={
                //  + 60
                43
              }
              text={"97.8K"}
              fontSize={13}
              fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
              align="start"
              fill="#333"
            />
            {/* //comment */}
            <Path
              x={
                (likesRef?.current ? likesRef?.current?.getTextWidth() : 0) + 56
              }
              y={height - 37}
              scale={{ x: 0.05, y: 0.05 }}
              fillRule="evenodd"
              clipRule="evenodd"
              data="M437.388 336.704C437.114 336.18 437.086 335.562 437.311 335.015L438.815 331.365C449.12 306.366 454.807 278.981 454.807 250.248C454.807 132.196 358.712 36.4954 240.173 36.4954C121.634 36.4954 25.5387 132.196 25.5387 250.248C25.5387 368.3 121.634 464.001 240.173 464.001C282.768 464.001 322.435 451.655 355.802 430.364L359.022 428.309C359.501 428.003 360.086 427.916 360.633 428.068L501.969 467.326C503.656 467.795 505.089 466.022 504.276 464.471L437.388 336.704ZM524.859 481.084C525.671 482.636 524.239 484.408 522.552 483.939L362.346 439.439C361.799 439.288 361.214 439.375 360.735 439.679C325.878 461.727 284.523 474.496 240.173 474.496C115.813 474.496 15 374.097 15 250.248C15 126.399 115.813 26 240.173 26C364.532 26 465.346 126.399 465.346 250.248C465.346 280.042 459.511 308.479 448.918 334.487C448.695 335.035 448.723 335.653 448.997 336.178L524.859 481.084Z"
              fill="#000"
              stroke="#000"
              strokeWidth={25}
            />
            <Text
              ref={commentRef}
              y={height - 30}
              x={
                (likesRef?.current ? likesRef?.current?.getTextWidth() : 0) +
                56 +
                33
              }
              text={"83"}
              fontSize={13}
              fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
              align="start"
              fill="#333"
            />
            {/* //share */}
            <Path
              x={
                (commentRef?.current
                  ? commentRef?.current?.getTextWidth()
                  : 0) +
                56 +
                80
              }
              y={height - 37}
              scale={{ x: 0.05, y: 0.05 }}
              fillRule="evenodd"
              clipRule="evenodd"
              data="M519.979 52.0287C521.631 52.0169 522.584 53.8994 521.597 55.2239L222.889 455.992C221.789 457.467 219.449 456.8 219.293 454.966L199.038 217.33C198.993 216.809 198.746 216.326 198.349 215.984L16.0424 59.1337C14.6416 57.9285 15.4847 55.6309 17.3326 55.6177L519.979 52.0287ZM209.211 216.336C208.483 216.704 208.052 217.478 208.121 218.29L226.223 430.671C226.38 432.504 228.72 433.172 229.82 431.696L494.965 75.959C496.227 74.2652 494.343 72.0254 492.458 72.9793L209.211 216.336ZM488.408 64.9946C490.293 64.0404 489.603 61.1951 487.49 61.2102L41.2705 64.3962C39.4226 64.4094 38.5796 66.7071 39.9804 67.9123L202.92 208.1C203.534 208.628 204.405 208.734 205.127 208.368L488.408 64.9946Z"
              fill="#000"
              stroke="#000"
              strokeWidth={25}
            />
            {multi &&
              Array.from({ length: multipost }).map((_, index) => (
                <Circle
                  key={index}
                  x={width / 2 + index * 8 - multipost * 3.4}
                  y={height - 60}
                  width={5}
                  height={5}
                  fill={!index ? "#0890e8" : "#d6d6d6"}
                />
              ))}

            <Path
              x={420 - 40}
              y={height - 37}
              scale={{ x: 0.05, y: 0.05 }}
              fillRule="evenodd"
              clipRule="evenodd"
              data="M430.277 26.7701H81.7231C78.4604 26.7701 75.8154 29.4049 75.8154 32.6552V496.797C75.8154 498.51 77.8293 499.43 79.1246 498.309L242.435 356.898C250.214 350.162 261.786 350.162 269.565 356.898L432.875 498.309C434.171 499.43 436.185 498.51 436.185 496.797V32.6552C436.185 29.4049 433.54 26.7701 430.277 26.7701ZM448 32.6552C448 22.9045 440.065 15 430.277 15H81.7231C71.9349 15 64 22.9045 64 32.6552V522.623C64 524.336 66.0139 525.256 67.3092 524.135L250.187 365.781C253.52 362.894 258.48 362.894 261.813 365.781L444.691 524.135C445.986 525.256 448 524.336 448 522.623V32.6552Z"
              fill="#000"
              stroke="#000"
              strokeWidth={25}
            />
          </Layer>
        </Stage>
        {/* Download Button */}
        <button
          onClick={downloadImage}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download as Image
        </button>
      </div>
    </>
  );
};

export default PostGenerator;
