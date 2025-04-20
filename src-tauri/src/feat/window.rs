use crate::core::{handle, CoreManager};

/// with kill aria2c
pub fn quit(code: Option<i32>) {
    log::debug!(target: "app", "quit code: {:?}", code);

    let app_handle = handle::Handle::global().app_handle().unwrap();

    std::thread::spawn(move || {
        tauri::async_runtime::block_on(async {
            use tokio::time::{timeout, Duration};

            let core_future = timeout(Duration::from_secs(1), CoreManager::global().stop_engine());

            let _ = core_future.await;
        });
        app_handle.exit(code.unwrap_or(0));
    });
}
