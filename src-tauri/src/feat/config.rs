use anyhow::Result;

use crate::config::{Config, IMotrix};

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
