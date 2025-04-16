use std::fs;

use anyhow::Result;
use chrono::Local;
use log::LevelFilter;
use log4rs::{
    append::{console::ConsoleAppender, file::FileAppender},
    config::{Appender, Logger, Root},
    encode::pattern::PatternEncoder,
};

use crate::{
    config::{IAria2Temp, IMotrix},
    log_err,
    utils::{
        dirs,
        help::{self, simple_save_file},
    },
};

pub fn init_log() -> Result<()> {
    let log_dir = dirs::app_logs_dir()?;

    if !log_dir.exists() {
        let _ = fs::create_dir_all(&log_dir);
    }

    let local_time = Local::now().format("%Y-%m-%d-%H%M").to_string();
    let log_file = format!("{}.log", local_time);
    let log_file = log_dir.join(log_file);

    let encode = Box::new(PatternEncoder::new("{d(%Y-%m-%d %H:%M:%S)} {l} - {m}{n}"));
    // TODO: according to motrix config
    let log_level = LevelFilter::Info;

    let stdout = ConsoleAppender::builder().encoder(encode.clone()).build();
    let to_file = FileAppender::builder().encoder(encode).build(log_file)?;

    let mut logger_builder = Logger::builder();
    let root_builder = Root::builder();

    logger_builder = logger_builder.appender("stdout").appender("file");

    let (config, _) = log4rs::config::Config::builder()
        .appender(Appender::builder().build("stdout", Box::new(stdout)))
        .appender(Appender::builder().build("file", Box::new(to_file)))
        .logger(logger_builder.additive(false).build("app", log_level))
        .build_lossy(root_builder.build(log_level));

    log4rs::init_config(config)?;

    Ok(())
}

pub fn init_config() -> Result<()> {
    let _ = init_log();
    // TODO: auto clear log

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
            let _ = help::save_yaml(
                &motrix_path,
                &IMotrix::template(),
                Some("# Created by tauri-motrix"),
            );
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
