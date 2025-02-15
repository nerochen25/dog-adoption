import React from "react";

export interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
  fillColor?: string;
  strokeColor?: string;
  standout?: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({
  filled = false,
  fillColor = "#FFD700",
  strokeColor = "#FFD700",
  standout = true,
  ...props
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {standout && (
        <defs>
          <filter id="starShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="rgba(0,0,0,0.5)"
            />
          </filter>
        </defs>
      )}
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? fillColor : "none"}
        stroke={filled ? "none" : strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={standout ? "url(#starShadow)" : undefined}
      />
    </svg>
  );
};

export default StarIcon;
