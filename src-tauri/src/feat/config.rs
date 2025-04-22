use std::collections::HashMap;

use anyhow::Result;
use serde_json::json;

use crate::{
    config::{Config, IMotrix},
    service,
};

// Define update flags as bitflags for better performance
#[derive(Clone, Copy)]
enum UpdateFlags {
    None = 0,
}

/// expose outside for motrix config
pub async fn patch_motrix(data: IMotrix) -> Result<()> {
    Config::motrix().draft().patch_config(data.clone());

    let language = data.language;

    let _: i32 = UpdateFlags::None as i32;

    let res: Result<()> = {
        if language.is_some() {}

        Ok(())
    };

    match res {
        Ok(()) => {
            Config::motrix().apply();
            let _ = Config::motrix().data().save_file();
            Ok(())
        }
        Err(err) => {
            Config::motrix().discard();
            Err(err)
        }
    }
}

pub async fn patch_aria2(data: HashMap<String, String>) -> Result<()> {
    Config::aria2().draft().patch_config(data.clone());

    // TODO: check conf

    let res = {
        service::aria2c::change_global_option(&[json!(data)]).await?;
        <Result<()>>::Ok(())
    };

    match res {
        Ok(()) => {
            Config::aria2().apply();
            let _ = Config::aria2().data().save_file();

            Ok(())
        }
        Err(err) => {
            Config::aria2().discard();
            Err(err)
        }
    }
}
