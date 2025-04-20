use std::{collections::HashMap, fs};

use once_cell::sync::Lazy;
use serde_json::Value;

use crate::{config::Config, utils::dirs};

const DEFAULT_LANGUAGE: &str = "en-US";

static TRANSLATIONS: Lazy<HashMap<String, Value>> = Lazy::new(|| {
    let mut translations = HashMap::new();

    if let Some(locales_dir) = dirs::locales_dir() {
        for lang in get_supported_languages() {
            let file_path = locales_dir.join(format!("{}.json", lang));
            if let Ok(content) = fs::read_to_string(file_path) {
                if let Ok(json) = serde_json::from_str(&content) {
                    translations.insert(lang.to_string(), json);
                }
            }
        }
    }
    translations
});

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

pub fn t(key: &str) -> String {
    // no need manual set language
    let current_language = Config::motrix()
        .latest()
        .language
        .clone()
        .unwrap_or(get_system_language());

    if let Some(text) = TRANSLATIONS
        .get(&current_language)
        .and_then(|trans| trans.get(key))
        .and_then(|val| val.as_str())
    {
        return text.to_string();
    }

    if current_language != DEFAULT_LANGUAGE {
        if let Some(text) = TRANSLATIONS
            .get(DEFAULT_LANGUAGE)
            .and_then(|trans| trans.get(key))
            .and_then(|val| val.as_str())
        {
            return text.to_string();
        }
    }
    key.to_string()
}
