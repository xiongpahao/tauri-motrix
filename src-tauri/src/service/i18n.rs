use std::fs;

use crate::utils::dirs;

const DEFAULT_LANGUAGE: &str = "en-US";

pub fn get_supported_languages() -> Vec<String> {
    let mut languages = Vec::new();

    if let Some(locales_dir) = dirs::locales_dir() {
        if let Ok(entries) = fs::read_dir(locales_dir) {
            for entry in entries.flatten() {
                if let Some(file_name) = entry.file_name().to_str() {
                    if let Some(lang) = file_name.strip_suffix(".json") {
                        languages.push(lang.to_string());
                    }
                }
            }
        }
    }
    // locales dir no one json file
    if languages.is_empty() {
        languages.push(DEFAULT_LANGUAGE.to_string());
    }
    languages
}

pub fn get_system_language() -> String {
    sys_locale::get_locale()
        .map(|locale| locale.to_lowercase())
        .and_then(|locale| locale.split(['_', '-']).next().map(String::from))
        .filter(|lang| get_supported_languages().contains(lang))
        .unwrap_or_else(|| DEFAULT_LANGUAGE.to_string())
}
