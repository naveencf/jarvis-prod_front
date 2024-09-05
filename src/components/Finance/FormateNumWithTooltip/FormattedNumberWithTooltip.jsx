import React, { useState, useRef, useEffect } from "react";
import "./FormateNumWithTooltip.css";

// Number formatting function
const formatNumber = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    return "Invalid number";
  }

  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} L`;
  } else {
    return value?.toFixed(2);
  }
};

// Number to words conversion function
const numberToWords = (num) => {
  const a = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const g = ["", "thousand", "lakh", "crore"];

  const convertHundreds = (num) => {
    if (num === "000") return "";
    const [h, t, o] = num.padStart(3, "0").split("").map(Number);
    let str = "";
    if (h) str += `${a[h]} hundred `;
    if (t > 1) str += b[t] + (o ? " " + a[o] : "");
    else if (t === 1) str += a[t * 10 + o];
    else str += a[o];
    return str.trim();
  };

  const convertGroup = (group, index) => {
    if (group === "000") return "";
    const groupWords = convertHundreds(group);
    return `${groupWords} ${g[index]}`.trim();
  };

  if (typeof num !== "string") return "";

  const [integerPart, fractionalPart] = num.split(".");

  const chunks = [];
  for (let i = integerPart.length; i > 0; i -= 2) {
    chunks.unshift(integerPart.slice(Math.max(i - 2, 0), i));
  }

  const integerWords = chunks
    .map((chunk, index) => convertGroup(chunk, chunks.length - 1 - index))
    .filter((group) => group !== "")
    .join(" ");

  const fractionalWords = fractionalPart
    ? fractionalPart
        .split("")
        .map((digit) => a[parseInt(digit)])
        .join(" ")
    : "";

  let words = integerWords;
  if (fractionalPart) {
    words += ` point ${fractionalWords}`;
  }

  return words.charAt(0).toUpperCase() + words?.slice(1);
};

const FormattedNumberWithTooltip = ({ value }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const tooltipRef = useRef(null);

  const showTooltip = (event) => {
    setTooltip((prevTooltip) => ({
      visible: true,
      x: event.clientX + 10,
      y: event.clientY + 10,
      // text: numberToWords(value.toString()),
    }));
  };

  const hideTooltip = () => {
    setTooltip((prevTooltip) => ({
      ...prevTooltip,
      visible: false,
    }));
  };

  useEffect(() => {
    if (tooltip.visible) {
      const handleMouseMove = (event) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.clientX + 10}px`;
          tooltipRef.current.style.top = `${event.clientY + 10}px`;
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [tooltip.visible]);

  return (
    <span
      className="formatted-number-with-tooltip"
      onMouseEnter={showTooltip}
      onMouseMove={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {formatNumber(value)}
      {/* {tooltip.visible && (
        <div ref={tooltipRef} className="tooltip_data">
          {tooltip.text}
        </div>
      )} */}
    </span>
  );
};

export default FormattedNumberWithTooltip;
