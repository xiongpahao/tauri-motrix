use std::path::PathBuf;

use crate::config::Config;

#[derive(Debug)]
pub struct CoreManager {}

impl CoreManager {
    /// Start core by sidecar
    async fn run_core_by_sidecar(&self, config_path: &PathBuf) {
        let aria2 = { Config::motrix().latest().clone() };
    }
}
