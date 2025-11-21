import clsx from "clsx";
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

interface CustomProps {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  hoverClassName?: string;
}

type Props = CustomProps & ComponentPropsWithoutRef<"button">;

export default function Button({
  className,
  style,
  children,
  onClick,
  hoverClassName,
  ...props
}: Props) {
  return (
    <button
      onClick={onClick}
      className={clsx("btn relative group overflow-hidden", className)}
      style={style}
      {...props}
    >
      <span> {children}</span>
      <span
        className={clsx(
          "absolute inset-0 text-black transition-transform duration-150 rounded-full group-hover:translate-y-0 bg-white translate-y-full  w-full h-full flex justify-center items-center",
          hoverClassName
        )}
      >
        {children}
      </span>
    </button>
  );
}
