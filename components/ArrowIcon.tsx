type ArrowDirection = "external" | "down" | "back" | "forward";

export function ArrowIcon({ direction, className = "" }: { direction: ArrowDirection; className?: string }) {
  const path = {
    external: "M2 8h12M9.5 3.5 14 8l-4.5 4.5",
    down: "M8 2v12M3.5 9.5 8 14l4.5-4.5",
    back: "M14 8H2M6.5 3.5 2 8l4.5 4.5",
    forward: "M2 8h12M9.5 3.5 14 8l-4.5 4.5",
  }[direction];

  return (
    <svg
      className={`arrow-icon icon-arrow-${direction} ${className}`.trim()}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
