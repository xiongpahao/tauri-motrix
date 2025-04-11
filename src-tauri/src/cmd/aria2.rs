use std::collections::HashMap;

use anyhow::Result;

use crate::config::{Aria2Info, Config};

pub type CmdResult<T = ()> = Result<T, String>;
/// get aria2 config of sidecar
#[tauri::command]
pub async fn get_aria2_info() -> CmdResult<Aria2Info> {
    Ok(Config::aria2().latest().get_client_info())
}

#[tauri::command]
pub async fn get_aria2_config() -> CmdResult<HashMap<String, String>> {
    Ok(Config::aria2().latest().clone().0)
}
