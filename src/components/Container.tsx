import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  status: string;
  className?: string;
  children: ReactNode;
};

export default function Container({ status, className, children }: Props) {
  return (
    <main
      className={clsx(
        "w-screen h-screen flex flex-col justify-center items-center gap-4 bg-linear-to-b",
        {
          "from-green-300 to-green-400": status === "rest",
          "from-indigo-300 to-indigo-400":
            status === "working" || status === "cancelled",
          "from-red-300 to-red-400": status === "paused",
        },
        className
      )}
    >
      {children}
    </main>
  );
}
