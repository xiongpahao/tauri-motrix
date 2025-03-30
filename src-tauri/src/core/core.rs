use std::path::PathBuf;

use crate::config::Config;

#[derive(Debug)]
pub struct CoreManager {}

impl CoreManager {
    async fn run_core_by_sidecar(&self, config_path: &PathBuf) -> Result<()> {
        let aria2 = Config::aria2();
    }
}
