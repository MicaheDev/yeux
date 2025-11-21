import clsx from "clsx";

type Props = {
  status: string;
  progressPercentage: number;
};

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressCircle({ status, progressPercentage }: Props) {
  // Calcular el desplazamiento del trazo (stroke-dashoffset)
  const strokeOffset = CIRCUMFERENCE * (1 - progressPercentage / 100);

  return (
    <div className="relative w-20 h-20 flex justify-center bg-black items-center overflow-hidden outline-2 rounded-full">
      <svg
        className="absolute w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
      >
        {/* Círculo de Fondo (Gris) */}
        <circle
          className="stroke-black fill-black"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeWidth="8"
          fill="none"
        ></circle>
        {/* Círculo de Progreso (Animado) */}
        <circle
          className={clsx({
            "stroke-indigo-400": status === "working" || status === "cancelled",
            "stroke-green-400": status === "rest",
            "stroke-red-400": status === "paused",
          })}
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          // status del progreso basado en el estado
          strokeWidth="90"
          // Propiedades SVG para la animación
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
        ></circle>
      </svg>
    </div>
  );
}
