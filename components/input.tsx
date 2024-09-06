import classNames from "classnames";
import { forwardRef, InputHTMLAttributes } from "react";
import { Input as HeadlessInput } from "@headlessui/react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", disabled, ...props }, ref) => {
    const inputClassNames = classNames(
      "transition-colors hover:border-blue-600",
      { "opacity-50 pointer-events-none bg-gray-40/10": disabled },
      className
    );
    return <HeadlessInput ref={ref} className={inputClassNames} {...props} />;
  }
);

Input.displayName = "Input";

export default Input;
