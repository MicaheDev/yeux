import { Dispatch, SetStateAction } from "react";
import Button from "./Button";
import clsx from "clsx";
import { Status } from "../types";

type Props = {
  status: string;
  setStatus: Dispatch<SetStateAction<Status>>;
  isRestTimeElapsed: boolean;
  isWorkingTimeElapsed: boolean;
};

export default function ControlButton({
  status,
  setStatus,
  isRestTimeElapsed,
  isWorkingTimeElapsed,
}: Props) {
  if (status === "paused" || status === "cancelled") {
    return (
      <>
        <Button
          className={clsx("bg-indigo-400", {
            "bg-indigo-400": status === "cancelled",
            "bg-red-400": status === "paused",
          })}
          onClick={() =>
            setStatus(
              isRestTimeElapsed && !isWorkingTimeElapsed ? "rest" : "working"
            )
          }
        >
          Start
        </Button>
      </>
    );
  }

  if (status === "working" || status === "rest") {
    return (
      <Button
        className={clsx({
          "bg-indigo-400": status === "working",
          "bg-green-400": status === "rest",
        })}
        onClick={() => setStatus("paused")}
      >
        Pause
      </Button>
    );
  }
  return null;
}
