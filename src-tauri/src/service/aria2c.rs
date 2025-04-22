use anyhow::Result;
use serde_json::{json, Value};

use crate::{config::Config, logging, utils::logging::Type};

pub fn get_aria2_client_info() -> (String, String) {
    let client = { Config::aria2().latest().get_client_info() };
    let server = format!("http://{}", client.server);

    // TODO: replace secret
    let secret = "".into();
    (server, secret)
}

pub async fn call(name: &str, data: &[Value]) -> Result<Value> {
    let (server, _secret) = get_aria2_client_info();

    let url = format!("{}/jsonrpc", server);
    let client = reqwest::Client::new();

    let id = uuid::Uuid::new_v4().to_string();

    let json_rpc_message = json!({
        "jsonrpc": "2.0",
        "method": name,
        "id": id,
        "params":data
    });

    println!("json_rpc_message: {}", json_rpc_message.to_string());

    let res = client
        .post(&url)
        .header("Content-Type", "application/json")
        .body(json_rpc_message.to_string())
        .send()
        .await
        .map_err(|e| {
            logging!(error, Type::Engine, true, "aria2c call error: {}", e);
            e
        })?
        .json::<Value>()
        .await?;

    println!("aria2c call result: {}", res.to_string());

    Ok(res)
}

pub async fn change_global_option(data: &[Value]) -> Result<Value> {
    call("aria2c.changeGlobalOption", data).await
}
