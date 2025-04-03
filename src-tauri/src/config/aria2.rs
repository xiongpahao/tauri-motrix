use std::{collections::HashMap, fmt};

use serde::Serialize;

#[derive(Debug, Default, Clone, Serialize)]
pub struct IAria2Temp(pub HashMap<String, String>);

impl IAria2Temp {
    pub fn template() -> Self {
        let mut map = HashMap::new();

        map.insert("enable-rpc".into(), "true".into());
        map.insert("rpc-allow-origin-all".into(), "true".into());
        map.insert("rpc-listen-all".into(), "true".into());

        Self(map)
    }
}

impl fmt::Display for IAria2Temp {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for (k, v) in &self.0 {
            writeln!(f, "{}={}\n", k, v)?;
        }

        Ok(())
    }
}
