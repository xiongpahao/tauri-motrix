use serde::{Deserialize, Serialize};

use crate::utils::{dirs, help};

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct IAria2 {}

impl IAria2 {
    pub fn new() -> Self {
        match dirs::aria2_path().and_then(|path| help::read_yaml::<IAria2>(&path)) {
            Ok(config) => config,
            Err(err) => {
                log::error!(target: "app", "{err}");
                Self::template()
            }
        }
    }

    pub fn template() -> Self {
        IAria2 {
            ..Default::default()
        }
    }
}
