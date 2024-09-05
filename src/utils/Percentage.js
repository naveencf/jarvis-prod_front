export default function handlePercentage(value) {
  const clampedValue = Math.max(0, Math.min(100, value));
  console.log(`Clamped percentage: ${clampedValue}`);
}
