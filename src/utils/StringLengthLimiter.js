function StringLengthLimiter(string, maxLength = 50) {
  return string?.length > maxLength
    ? `${string.slice(0, maxLength)}...`
    : string;
}

export default StringLengthLimiter;
