import React from "react";
import { ComponentPropsWithoutRef } from "react";
import classNames from "classnames";
import { Button as HeadlessButton } from "@headlessui/react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {}

export default function Button({ className, children, ...rest }: ButtonProps) {
  const classes = classNames(
    "transition-all font-display text-center whitespace-nowrap cursor-pointer py-2 px-3 rounded-xl",
    className,
    { "pointer-events-none opacity-50 select-none": rest.disabled }
  );

  return (
    <HeadlessButton className={classes} {...rest}>
      {children}
    </HeadlessButton>
  );
}
