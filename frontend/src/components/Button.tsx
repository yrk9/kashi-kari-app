import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className = "", ...props }: ButtonProps) => {
  return (
    <button
      className={`w-full py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
};
