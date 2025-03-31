use std::path::PathBuf;

use crate::config::Config;

#[derive(Debug)]
pub struct CoreManager {}

impl CoreManager {
    /// Start core by sidecar
    async fn run_core_by_sidecar(&self, config_path: &PathBuf) {
        let aria2_engine = { Config::motrix().latest().aria2_engine.clone() };
        let aria2_engine = aria2_engine.unwrap_or("aria2c".into());
    }
}
