use anyhow::Result;
use tauri::{
    menu::{Menu, MenuEvent, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Listener, Wry,
};

use crate::{core::handle, feat, utils::window::create_window};

use super::i18n::t;

/// 创建托盘图标和菜单，适配 Windows 和 macOS
pub fn create_tray(app_handle: &AppHandle) -> Result<()> {
    // 构建托盘图标
    let builder = TrayIconBuilder::with_id("main")
        .icon(app_handle.default_window_icon().unwrap().clone())
        .icon_as_template(cfg!(target_os = "macos")); // macOS 建议用模板图标，Windows 用普通图标

    // Windows 平台下设置左键不弹出菜单
    #[cfg(target_os = "windows")]
    let builder = builder.show_menu_on_left_click(false);

    // macOS 平台可添加特有行为，例如支持原生 menu bar，通常无需特殊处理
    #[cfg(target_os = "macos")]
    let builder = builder; // 可根据需要扩展 macOS 平台托盘行为

    // 其它平台直接用 builder
    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    let builder = builder;

    // 构建托盘
    let tray = builder.build(app_handle)?;

    // 绑定菜单事件
    tray.on_menu_event(on_menu_event);

    // 绑定托盘图标点击事件
    tray.on_tray_icon_event(on_tray_icon_event);

    Ok(())
}

/// 更新托盘菜单
pub fn update_tray_menu() -> Result<()> {
    let app_handle = handle::Handle::global().app_handle().unwrap();
    let tray = app_handle.tray_by_id("main").unwrap();

    let _ = tray.set_menu(Some(create_tray_menu(&app_handle)?));
    Ok(())
}

/// 创建托盘菜单
fn create_tray_menu(app_handle: &AppHandle) -> Result<Menu<Wry>> {
    let quit_i = MenuItem::with_id(app_handle, "quit", t("common.Exit"), true, None::<&str>)?;

    let add_task = MenuItem::with_id(
        app_handle,
        "add_task",
        t("common.DownloadFile"),
        true,
        None::<&str>,
    )?;

    // 可以根据平台增加菜单项
    #[cfg(target_os = "macos")]
    let menu = tauri::menu::MenuBuilder::new(app_handle)
        .items(&[&add_task, &quit_i]) // macOS 更常见“退出”在底部
        .build()
        .unwrap();

    #[cfg(not(target_os = "macos"))]
    let menu = tauri::menu::MenuBuilder::new(app_handle)
        .items(&[&quit_i, &add_task])
        .build()
        .unwrap();

    Ok(menu)
}

/// 托盘菜单事件处理
fn on_menu_event(_: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        "quit" => {
            println!("quit menu item was clicked");
            feat::quit(Some(0));
        }
        "add_task" => {
            println!("add task menu item was clicked");
            let minimized = create_window(true);

            let _ = handle::Handle::global().get_window().map(|window| {
                // Check if window is ready before emitting the event
                let window_clone = window.clone();
                const ADD_TASK_DIALOG: &str = "motrix://open-add-task-dialog";
                let add_fn = move || window_clone.emit(ADD_TASK_DIALOG, ()).unwrap();

                if minimized {
                    add_fn();
                } else {
                    window.once("motrix://web-ready", move |_| {
                        // Now the DOM is ready, we can emit the event
                        add_fn();
                    });
                }
            });
        }
        _ => {
            println!("menu item {:?} not handled", event.id);
        }
    }
}

/// 托盘图标点击事件处理
fn on_tray_icon_event(_: &TrayIcon, event: TrayIconEvent) {
    #[cfg(target_os = "windows")]
    {
        if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } = event
        {
            create_window(true);
        }
    }

    #[cfg(target_os = "macos")]
    {
        // macOS 上推荐支持右键菜单，左键直接显示主窗口
        match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                create_window(true);
            }
            TrayIconEvent::Click {
                button: MouseButton::Right,
                button_state: MouseButtonState::Up,
                ..
            } => {
                // 右键弹出菜单已由 tauri 自动处理，无需手动实现
            }
            _ => {}
        }
    }

    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    {
        if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } = event
        {
            create_window(true);
        }
    }
}
