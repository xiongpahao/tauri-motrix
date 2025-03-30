use std::sync::Arc;

use parking_lot::Mutex;

#[derive(Debug, Clone)]
pub struct Draft<T: Clone + ToOwned> {
    inner: Arc<Mutex<(T, Option<T>)>>,
}
