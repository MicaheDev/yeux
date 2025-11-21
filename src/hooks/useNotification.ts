// src/hooks/useNotification.ts

import { useEffect, useState } from "react";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { invoke } from "@tauri-apps/api/core";

/**
 * Hook para manejar los permisos y el envío de notificaciones de Tauri.
 * @returns Un objeto con el estado del permiso y la función para mostrar mensajes.
 */
export function useNotification() {
  const [permission, setPermission] = useState(false);

  // Solicitud y verificación de permisos al montar el componente
  useEffect(() => {
    async function notificationsHandler() {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      setPermission(permissionGranted);
    }
    notificationsHandler();
  }, []);

   function playSound() {
    invoke("play_default_sound")
      .catch((e) => console.error("Error al reproducir sonido:", e));
  }

  /**
   * Envía una notificación si el permiso está concedido.
   */
  function showMessage(title: string, message: string) {
    if (permission) {
      sendNotification({ title, body: message});
      playSound()
    }
  }

  return { permission, showMessage };
}