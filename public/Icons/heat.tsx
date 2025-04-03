import type React from "react";

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="miter"
    className={className}
  >
    <polyline points="2,8 2,6 4,4 8,4 10,6 12,8 14,6 16,4 20,4 22,6 22,8 20,10 18,12 16,14 14,16 12,18 10,16 8,14 6,12 4,10 2,8" />
  </svg>
);

export const HeartFilledIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="4.5"
    className={className}
  >
    <polygon points="2,8 2,6 4,4 8,4 10,6 12,8 14,6 16,4 20,4 22,6 22,8 20,10 18,12 16,14 14,16 12,18 10,16 8,14 6,12 4,10 2,8" />
  </svg>
);
