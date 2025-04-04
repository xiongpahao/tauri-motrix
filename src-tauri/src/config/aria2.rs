use std::{collections::HashMap, fmt};

use serde::Serialize;

use crate::utils::dirs::{aria2_download_session_path, path_to_str};

#[derive(Debug, Default, Clone, Serialize)]
pub struct IAria2Temp(pub HashMap<String, String>);

impl IAria2Temp {
    pub fn new() -> Self {
        // TODO: load from file

        Self::template()
    }

    pub fn template() -> Self {
        let mut map = HashMap::new();

        map.insert("enable-rpc".into(), "true".into());
        map.insert("rpc-allow-origin-all".into(), "true".into());
        map.insert("rpc-listen-all".into(), "true".into());
        map.insert("rpc-listen-port".into(), "16800".into());

        let save_session = aria2_download_session_path().unwrap();
        let save_session = path_to_str(&save_session).unwrap();

        map.insert("save-session".into(), save_session.into());
        map.insert("input-file".into(), save_session.into());

        Self(map)
    }

    pub fn get_client_info(&self) -> Aria2Info {
        let config = &self.0;

        let port = config
            .get("rpc-listen-port")
            .and_then(|value| value.parse().ok())
            .unwrap_or(16800);

        Aria2Info {
            port,
            // temporary solution, need to be fixed
            server: format!("127.0.0.1:{}", port),
        }
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

// expose to web
#[derive(Debug, Clone, Serialize)]
pub struct Aria2Info {
    pub port: u16,
    pub server: String,
}
