import { invoke } from "@tauri-apps/api/core";

export function getAria2Info() {
  return invoke<Aria2Info>("get_aria2_info");
}

export const getAria2Config = () =>
  invoke<Aria2Config | null>("get_aria2_config");

export const getMotrixConfig = () =>
  invoke<MotrixConfig | null>("get_motrix_config");

export const openLogsDir = () => invoke<void>("open_logs_dir");

export const openAppDir = () => invoke<void>("open_app_dir");

export const openCoreDir = () => invoke<void>("open_core_dir");
