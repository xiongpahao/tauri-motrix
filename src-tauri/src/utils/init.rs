use std::fs;

use anyhow::Result;

use crate::{
    config::{IAria2Temp, IMotrix},
    log_err,
    utils::{
        dirs,
        help::{self, simple_save_file},
    },
};

pub fn init_config() -> Result<()> {
    log_err!(dirs::app_home_dir().map(|app_dir| {
        if !app_dir.exists() {
            let _ = fs::create_dir_all(&app_dir);
        }
    }));

    log_err!(dirs::aria2_path().map(|aria2_path| {
        if !aria2_path.exists() {
            let _ = simple_save_file(&aria2_path, &IAria2Temp::template());
        }
    }));

    log_err!(dirs::motrix_path().map(|motrix_path| {
        if !motrix_path.exists() {
            let _ = help::save_yaml(&motrix_path, &IMotrix::template(), Some("# tauri-motrix"));
        }
    }));

    log_err!(dirs::aria2_download_session_path().map(|session_path| {
        if !session_path.exists() {
            let _ = fs::File::create(&session_path);
        }
    }));

    Ok(())
}

pub fn init_resources() -> Result<()> {
    let app_dir = dirs::app_home_dir()?;
    let res_dir = dirs::app_resources_dir()?;

    if !app_dir.exists() {
        let _ = fs::create_dir_all(&app_dir);
    }

    if !res_dir.exists() {
        let _ = fs::create_dir_all(&res_dir);
    }

    Ok(())
}
