use std::process::Command;
use tauri::Manager;

// --- COMANDO TAURI PARA REPRODUCIR SONIDO PERSONALIZADO ---
#[tauri::command]
fn play_custom_sound(app_handle: tauri::AppHandle, sound_filename: &str) -> Result<String, String> {
    // Obtener el path del recurso (archivo de sonido)
    let resource_path = app_handle.path()
        .resource_dir()
        .map_err(|e| format!("Error getting resource dir: {}", e))?;
    
    let sound_path = resource_path.join("assets").join(sound_filename);
    
    // Verificar si el archivo existe
    if !sound_path.exists() {
        return Err(format!("Sound file not found: {}", sound_path.display()));
    }

    let sound_path_str = sound_path.to_string_lossy().to_string();

    // Definimos el programa y los argumentos según el sistema operativo.
    let (program, args) = if cfg!(target_os = "macos") {
        (
            "afplay",
            vec![sound_path_str],
        )
    } else if cfg!(target_os = "linux") {
        (
            "aplay",
            vec![sound_path_str],
        )
    } else if cfg!(target_os = "windows") {
        (
            "powershell",
            vec![
                "-c".to_string(),
                format!(
                    "(New-Object Media.SoundPlayer '{}').PlaySync()",
                    sound_path_str.replace("\\", "\\\\")
                ),
            ],
        )
    } else {
        return Err("Sound playback not configured for this OS.".to_string());
    };

    // Ejecutamos el comando
    match Command::new(program).args(&args).spawn() {
        Ok(_) => {
            // Si quieres comportamiento asíncrono, no esperes
            // Si quieres comportamiento síncrono, descomenta la línea siguiente:
            // let _ = child.wait();
            Ok(format!("Playing sound: {}", sound_filename))
        },
        Err(e) => Err(format!("Error executing sound command ({}): {}", program, e)),
    }
}

// Versión simplificada que reproduce un sonido específico
#[tauri::command]
fn play_default_sound(app_handle: tauri::AppHandle) -> Result<String, String> {
    play_custom_sound(app_handle, "sound.wav")
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            play_default_sound
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}