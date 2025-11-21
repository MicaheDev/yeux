// src/hooks/useTimerState.ts

import { useEffect, useRef, useState } from "react";
import { Status } from "../types"; // Asumo que tu 'types.ts' está en la raíz
import { useNotification } from "./useNotification"; // Importamos el hook de notificaciones

// --- CONSTANTES ---
const REST_TIME_TOTAL_SECONDS = 20; // 20 segundos de descanso
const WORKING_TIME_START = { minutes: 20, seconds: 0 }; // Tiempo de trabajo inicial (20 minutos)

interface TimerDisplay {
  minutes: number;
  seconds: number;
}

/**
 * Hook que gestiona el estado y la lógica de los temporizadores de trabajo y descanso.
 */
export function useTimerState() {
  const { showMessage } = useNotification();

  // Estados
  const [workingTimer, setWorkingTimer] =
    useState<TimerDisplay>(WORKING_TIME_START);
  const [restTimer, setRestTimer] = useState(REST_TIME_TOTAL_SECONDS);
  const [status, setStatus] = useState<Status>("cancelled");

  // Refs de control
  const intervalIdRef = useRef<number | null>(null);
  const isInitialRunRef = useRef(true);
  const prevStatusRef = useRef<Status>("cancelled");

  // Función genérica para limpiar cualquier intervalo activo
  const stopInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  // Reinicia los temporizadores a sus valores iniciales
  const resetTimers = () => {
    setWorkingTimer(WORKING_TIME_START);
    setRestTimer(REST_TIME_TOTAL_SECONDS);
  };

  // --- Lógica de Modo: Trabajo ---
  const startWorkingMode = () => {
    intervalIdRef.current = setInterval(() => {
      setWorkingTimer((prevTimer) => {
        let { minutes, seconds } = prevTimer;

        if (minutes === 0 && seconds === 0) {
          setStatus("rest");
          return WORKING_TIME_START;
        }

        if (seconds === 0) {
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        return { minutes, seconds };
      });
    }, 1000);
  };

  // --- Lógica de Modo: Descanso ---
  const startRestMode = () => {
    intervalIdRef.current = setInterval(() => {
      setRestTimer((prevSeconds) => {
        if (prevSeconds === 0) {
          setStatus("working");
          return REST_TIME_TOTAL_SECONDS;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  // --- Lógica del Ciclo de Vida del Temporizador (useEffect principal) ---
  useEffect(() => {
    stopInterval();

    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    const shouldNotify = prevStatus !== "cancelled" || !isInitialRunRef.current;

    if (status === "working") {
      startWorkingMode();
      if (shouldNotify) {
        showMessage(
          "Back to Work! 💻", // Título en inglés
          "Rest time is over. Get back to focusing on your task." ,// Mensaje en inglés
        );
      }
    } else if (status === "rest") {
      startRestMode();
      if (shouldNotify) {
        showMessage(
          "Time to Rest! 🧘", // Título en inglés
          "Look at something 20 feet (6 meters) away for 20 seconds. Your eyes will thank you!", // Mensaje en inglés
        );
      }
    }

    if (status !== "cancelled" && status !== "paused") {
      isInitialRunRef.current = false;
    }

    // Cleanup del intervalo al desmontar o al cambiar 'status'
    return () => {
      stopInterval();
    };
  }, [status]); // Dependencia del estado principal

  // --- Funciones de Control ---

  const handleCancel = () => {
    setStatus("cancelled");
    isInitialRunRef.current = true;
    resetTimers();
  };

  // --- Valores Derivados para la Vista ---

  const totalWorkingSeconds =
    WORKING_TIME_START.minutes * 60 + WORKING_TIME_START.seconds;
  const currentTotalWorkingSeconds =
    workingTimer.minutes * 60 + workingTimer.seconds;

  // Calcula el porcentaje de progreso para el círculo SVG
  const calculateProgress = () => {
    let totalTime = 0;
    let timeLeft = 0;

    // Determinar el tiempo total y el tiempo restante basado en el modo
    if (
      status === "working" ||
      (status === "paused" && currentTotalWorkingSeconds > 0) ||
      (status === "cancelled" &&
        currentTotalWorkingSeconds < totalWorkingSeconds)
    ) {
      totalTime = totalWorkingSeconds;
      timeLeft = currentTotalWorkingSeconds;
    } else if (
      status === "rest" ||
      (status === "paused" && restTimer < REST_TIME_TOTAL_SECONDS)
    ) {
      totalTime = REST_TIME_TOTAL_SECONDS;
      timeLeft = restTimer;
    } else {
      // Estado 'cancelled' o inicio
      totalTime = totalWorkingSeconds;
      timeLeft = totalTime;
    }

    if (totalTime === 0 || timeLeft < 0) return 100;
    return (timeLeft / totalTime) * 100;
  };

  const progressPercentage = calculateProgress();

  const workingTimerDisplay = `${workingTimer.minutes} MIN ${
    workingTimer.seconds < 10
      ? `0${workingTimer.seconds} SEC`
      : `${workingTimer.seconds} SEC`
  }`;

  const isWorkingTimeElapsed = currentTotalWorkingSeconds < totalWorkingSeconds;

  const isRestTimeElapsed = restTimer < REST_TIME_TOTAL_SECONDS;

  // Define lo que se muestra en el centro del temporizador
  const currentDisplay =
    status === "working"
      ? workingTimerDisplay
      : status === "rest"
      ? `${restTimer} SEC`
      : isWorkingTimeElapsed
      ? workingTimerDisplay
      : isRestTimeElapsed
      ? `${restTimer} SEC`
      : `${WORKING_TIME_START.minutes} MIN 00 SEC`;

  return {
    status,
    setStatus,
    handleCancel,
    progressPercentage,
    currentDisplay,
    isRestTimeElapsed,
    isWorkingTimeElapsed,
  };
}
