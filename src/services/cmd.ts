import { invoke } from "@tauri-apps/api/core";

export function getAria2Info() {
  return invoke<Aria2Info>("get_aria2_info");
}
