use log::LevelFilter;
use serde::{Deserialize, Serialize};

use crate::{
    service::i18n,
    utils::{dirs, help},
};

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct IMotrix {
    /// aria2c run name for sidecar
    pub aria2_engine: Option<String>,

    pub app_hide_window: Option<bool>,

    // i18n
    pub language: Option<String>,

    /// app log level
    /// silent | error | warn | info | debug | trace
    pub app_log_level: Option<String>,

    /// `light` or `dark` or `system`
    pub theme_mode: Option<String>,
    /// 0 -> no clear
    /// 1 -> 7 day
    /// 2 -> 30 day
    /// 3 -> 90 day
    pub auto_log_clean: Option<i32>,
}

impl IMotrix {
    pub fn new() -> Self {
        match dirs::motrix_path().and_then(|path| help::read_yaml::<IMotrix>(&path)) {
            Ok(config) => config,
            Err(err) => {
                log::error!(target: "app", "{err}");
                Self::template()
            }
        }
    }

    pub fn template() -> Self {
        IMotrix {
            aria2_engine: Some("aria2c".into()),
            app_hide_window: Some(false),
            language: i18n::get_system_language().into(),
            theme_mode: Some("system".into()),
            ..Self::default()
        }
    }

    /// patch motrix config
    /// only save to file
    ///
    pub fn patch_config(&mut self, patch: IMotrix) {
        macro_rules! patch {
            ($key: ident) => {
                if patch.$key.is_some() {
                    self.$key = patch.$key;
                }
            };
        }

        patch!(theme_mode);
        patch!(app_log_level);
        patch!(aria2_engine);
        patch!(app_hide_window);
        patch!(language);
    }
}
