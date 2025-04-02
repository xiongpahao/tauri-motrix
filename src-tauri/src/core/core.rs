use anyhow::Result;
use fs2::FileExt;
use once_cell::sync::OnceCell;
use std::{path::PathBuf, sync::Arc, time::Duration};
use tauri_plugin_shell::ShellExt;
use tokio::{sync::Mutex, time::sleep};

use crate::{
    config::{Config, ConfigType},
    core::handle,
    log_err,
    utils::dirs,
};

#[derive(Debug)]
pub struct CoreManager {
    running: Arc<Mutex<bool>>,
}

impl CoreManager {
    pub fn global() -> &'static CoreManager {
        static CORE_MANGER: OnceCell<CoreManager> = OnceCell::new();
        CORE_MANGER.get_or_init(|| CoreManager {
            running: Arc::new(Mutex::new(false)),
        })
    }

    pub async fn init(&self) -> Result<()> {
        log::trace!("run core start engine");
        log_err!(Self::global().start_engine().await);
        log::trace!("run core end engine");
        Ok(())
    }
    pub async fn start_engine(&self) -> Result<()> {
        let mut running = self.running.lock().await;

        if *running {
            log::info!("engine is running");
            return Ok(());
        }

        let config_path = Config::generate_file(ConfigType::Run)?;

        self.run_core_by_sidecar(&config_path).await?;

        *running = true;

        Ok(())
    }
    /// Start core by sidecar
    async fn run_core_by_sidecar(&self, config_path: &PathBuf) -> Result<()> {
        let aria2_engine = { Config::motrix().latest().aria2_engine.clone() };
        let aria2_engine = aria2_engine.unwrap_or("aria2c".into());

        log::info!(target: "app", "starting core {} in sidecar mode", aria2_engine);
        println!("[sidecar]: Begin run engine: {}", aria2_engine);

        if let Ok(pids) = self.check_existing_processes(&aria2_engine).await {
            if !pids.is_empty() {
                println!("[sidecar] Already running process");

                // TODO
            }
        } else {
            println!("[sidecar] Failed to check existing processes");
        }

        let lock_file = dirs::app_home_dir()?.join(format!("{}.lock", aria2_engine));
        println!("[sidecar] lock_file path : {:?}", lock_file);

        println!("[sidecar] Try to get lock file");
        let file = std::fs::OpenOptions::new()
            .write(true)
            .create(true)
            .open(&lock_file)?;

        match file.try_lock_exclusive() {
            Ok(_) => {
                println!("[sidecar] Get lock file success");
                log::info!(target: "app", "acquired lock for core process");

                handle::Handle::global().set_core_lock(file);
            }
            // TODO
            Err(_) => todo!(),
        }

        let app_handle = handle::Handle::global()
            .app_handle()
            .ok_or(anyhow::anyhow!("failed to get app handle"))?;

        let config_path_str = dirs::path_to_str(config_path)?;

        println!("[sidecar] Begin start run core process");
        let (_, child) = app_handle
            .shell()
            .sidecar(aria2_engine)?
            .args(["--conf-path", config_path_str])
            .spawn()?;

        // save process id
        println!("[sidecar] run core process success, PID: {:?}", child.pid());
        handle::Handle::global().set_core_process(child);

        sleep(Duration::from_millis(300)).await;

        println!("[sidecar] run core process done.");
        log::info!(target: "app", "core started in sidecar mode");

        Ok(())
    }

    async fn check_existing_processes(&self, process_name: &str) -> Result<Vec<u32>> {
        println!(
            "[check_process] Check if the process exists in the system: {}",
            process_name
        );

        #[cfg(target_os = "windows")]
        {
            use std::process::Command;

            println!("[check_process] Use 'tasklist' command for Windows");

            let output = Command::new("tasklist")
                .args(["/FO", "CSV", "/NH"])
                .output()?;

            let output = String::from_utf8_lossy(&output.stdout);

            let pids: Vec<u32> = output
                .lines()
                .filter(|line| line.contains(process_name))
                .filter_map(|line| {
                    println!("[check_process] Found Line: {}", line);
                    let parts: Vec<&str> = line.split(',').collect();
                    if parts.len() >= 2 {
                        let pid_str = parts[1].trim_matches('"');
                        pid_str.parse::<u32>().ok().map(|pid| {
                            println!("[check_process] Found PID of the process: {}", pid);
                            pid
                        })
                    } else {
                        None
                    }
                })
                .collect();

            println!("[check_process] Found {} processes", pids.len());
            Ok(pids)
        }
    }
}
