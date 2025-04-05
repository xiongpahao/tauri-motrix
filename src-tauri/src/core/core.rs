use anyhow::Result;
use fs2::FileExt;
use once_cell::sync::OnceCell;
use std::{path::PathBuf, sync::Arc, time::Duration};
use tauri_plugin_shell::ShellExt;
use tokio::{sync::Mutex, time::sleep};

use crate::{
    config::Config,
    core::handle,
    log_err,
    utils::{
        dirs::{self, aria2_path},
        sys,
    },
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

        let config_path = aria2_path()?;

        self.ensure_port_available().await;
        self.run_core_by_sidecar(&config_path).await?;

        *running = true;

        Ok(())
    }

    pub async fn ensure_port_available(&self) {
        let aria2_map = Config::aria2().latest().0.clone();
        let aria2_port = aria2_map
            .get("rpc-listen-port")
            .and_then(|value| value.parse::<u16>().ok())
            .unwrap_or(16800);

        println!("[sidecar] Check existing port: {}", aria2_port);

        let occupies = sys::get_occupied_port_pids(aria2_port).await;

        if !occupies.is_empty() {
            println!("[sidecar] port {} is already occupied", aria2_port);
        }

        for pid in occupies {
            println!("[sidecar] try to kill process: {}", pid);
            sys::terminate_process(pid).await;
        }

        println!("[sidecar] Waiting for process to exit...");
        sleep(Duration::from_millis(500)).await;
    }

    /// Start core by sidecar
    async fn run_core_by_sidecar(&self, config_path: &PathBuf) -> Result<()> {
        let aria2_engine = { Config::motrix().latest().aria2_engine.clone() };
        let aria2_engine = aria2_engine.unwrap_or("aria2c".into());

        log::info!(target: "app", "starting core {} in sidecar mode", aria2_engine);
        println!("[sidecar]: Begin run engine: {}", aria2_engine);

        let lock_file = dirs::app_home_dir()?.join(format!("{}.lock", aria2_engine));
        println!("[sidecar] lock_file path : {:?}", lock_file);

        println!("[sidecar] try to get lock file");
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
}
