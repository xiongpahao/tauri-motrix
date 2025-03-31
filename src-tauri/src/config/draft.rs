use std::sync::Arc;

use parking_lot::{MappedMutexGuard, Mutex, MutexGuard};

use super::aria2::IAria2;

#[derive(Debug, Clone)]
pub struct Draft<T: Clone + ToOwned> {
    inner: Arc<Mutex<(T, Option<T>)>>,
}

macro_rules! draft_define {
    ($id: ident) => {
        impl Draft<$id> {
            pub fn latest(&self) -> MappedMutexGuard<$id> {
                MutexGuard::map(self.inner.lock(), |inner| {
                    if inner.1.is_none() {
                        &mut inner.0
                    } else {
                        inner.1.as_mut().unwrap()
                    }
                })
            }
        }
        impl From<$id> for Draft<$id> {
            fn from(data: $id) -> Self {
                Draft {
                    inner: Arc::new(Mutex::new((data, None))),
                }
            }
        }
    };
}

draft_define!(IAria2);
