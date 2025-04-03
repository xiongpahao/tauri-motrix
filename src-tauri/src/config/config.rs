use anyhow::Result;
use once_cell::sync::OnceCell;

use super::{motrix::IMotrix, Draft};

pub struct Config {
    motrix_config: Draft<IMotrix>,
}

impl Config {
    pub fn global() -> &'static Config {
        static CONFIG: OnceCell<Config> = OnceCell::new();

        CONFIG.get_or_init(|| Config {
            motrix_config: Draft::from(IMotrix::new()),
        })
    }

    pub async fn init_config() -> Result<()> {
        // TODO
        Ok(())
    }

    pub fn motrix() -> Draft<IMotrix> {
        Self::global().motrix_config.clone()
    }
}

// #[derive(Debug)]
// pub enum ConfigType {
//     Run,
//     Check,
// }
