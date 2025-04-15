use crate::config::{Config, IMotrix};

use super::CmdResult;

#[tauri::command]
pub fn get_motrix_config() -> CmdResult<IMotrix> {
    Ok(Config::motrix().latest().clone())
}
