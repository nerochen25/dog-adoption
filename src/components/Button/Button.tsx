import React from "react";
import cn from "classnames";
import styles from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) => {
  const buttonClasses = cn(
    styles.button,
    styles[variant],
    styles[size],
    className
  );
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
