use once_cell::sync::OnceCell;

use super::{aria2::IAria2, Draft};

pub struct Config {
    aria2_config: Draft<IAria2>,
}

impl Config {
    pub fn global() -> &'static Config {
        static CONFIG: OnceCell<Config> = OnceCell::new();

        CONFIG.get_or_init(|| Config {
            aria2_config: Draft::from(IAria2::new()),
        })
    }
    pub fn aria2() -> Draft<IAria2> {
        Self::global().aria2_config.clone()
    }
}
