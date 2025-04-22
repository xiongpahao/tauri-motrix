use anyhow::Result;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App,
};

use crate::{feat, utils::window::create_window};

use super::i18n::t;

pub fn create_tray(app: &App) -> Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", t("common.Exit"), true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_i])?;

    let mut builder = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu);

    #[cfg(target_os = "windows")]
    {
        builder = builder.show_menu_on_left_click(false);
    }

    let tray = builder.build(app)?;

    tray.on_menu_event(|_app, event| match event.id.as_ref() {
        "quit" => {
            println!("quit menu item was clicked");
            feat::quit(Some(0));
        }
        _ => {
            println!("menu item {:?} not handled", event.id);
        }
    });

    tray.on_tray_icon_event(|_, event| {
        if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } = event
        {
            create_window(true);
        }
    });

    Ok(())
}
