use std::sync::Arc;

use once_cell::sync::OnceCell;
use parking_lot::RwLock;
use tauri::AppHandle;

#[derive(Debug, Clone)]
pub struct Handle {
    pub app_handle: Arc<RwLock<Option<AppHandle>>>,
}

impl Handle {
    pub fn global() -> &'static Handle {
        static HANDLE: OnceCell<Handle> = OnceCell::new();

        HANDLE.get_or_init(|| Handle {
            app_handle: Arc::new(RwLock::new(None)),
        })
    }

    pub fn app_handle(&self) -> Option<AppHandle> {
        self.app_handle.read().clone()
    }
}
