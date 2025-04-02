use serde::{Deserialize, Serialize};
use serde_yaml::Mapping;

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct IRuntime {
    pub config: Option<Mapping>,
}

impl IRuntime {
    pub fn new() -> Self {
        Self::default()
    }
}
