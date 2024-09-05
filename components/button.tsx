import React from "react";
import { ComponentPropsWithoutRef } from "react";
import classNames from "classnames";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {}

export default function Button({ className, children, ...rest }: ButtonProps) {
  const classes = classNames(
    "transition-all font-display text-center flex gap-2 items-center whitespace-nowrap cursor-pointer text-black bg-white hover:bg-translucent-900 active:bg-translucent-800 py-2 px-3 rounded-xl",
    { "pointer-events-none opacity-50 select-none": rest.disabled },
    className
  );
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
