use serde::{Deserialize, Serialize};

use crate::utils::{dirs, help};

#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct IMotrix {
    /// aria2c run name for sidecar
    pub aria2_engine: Option<String>,
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
            ..Self::default()
        }
    }
}
