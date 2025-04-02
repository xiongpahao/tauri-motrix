use tauri::{App, Manager};

use crate::{
    config::Config,
    core::{handle, CoreManager},
    log_err,
};

pub async fn resolve_setup(app: &App) {
    // let version = app.package_info().version.to_string();
    handle::Handle::global().init(app.app_handle());

    log::trace!(target:"app", "init config");
    log_err!(Config::init_config().await);

    log::trace!(target: "app", "launch core");
    log_err!(CoreManager::global().init().await);
}
