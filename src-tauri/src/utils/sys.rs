use std::process::Command;

// to kill process
pub async fn terminate_process(pid: u32) {
    println!("[terminate_process] try to kill PID: {}", pid);

    #[cfg(target_os = "windows")]
    {
        let output = Command::new("taskkill")
            .args(["/F", "/PID", &pid.to_string()])
            .output();

        match output {
            Ok(output) => {
                if output.status.success() {
                    println!("[terminate_process] successfully kill PID: {}", pid);
                } else {
                    let stderr: std::borrow::Cow<'_, str> = String::from_utf8_lossy(&output.stderr);
                    println!("[terminate_process] failed to kill: {}", stderr);
                }
            }
            Err(err) => {
                println!("[terminate_process] failed to command: {:?}", err);
            }
        }
    }
    #[cfg(target_os = "macos")]
    {
        let output = Command::new("kill")
            .args(["-9", &pid.to_string()])
            .output();

        match output {
            Ok(output) => {
                if output.status.success() {
                    println!("[terminate_process] successfully killed PID: {}", pid);
                } else {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    println!("[terminate_process] failed to kill: {}", stderr);
                }
            }
            Err(err) => {
                println!("[terminate_process] failed to command: {:?}", err);
            }
        }
    }
}


pub async fn get_occupied_port_pids(port: u16) -> Vec<u32> {
    println!("[check_port] whether port {} is available", port);

    let mut pids: Vec<u32> = [].to_vec();

    #[cfg(target_os = "windows")]
    {
        let output = Command::new("netstat")
            .args(["-ano"])
            .output()
            .expect("failed to execute netstat command");

        if output.status.success() {
            let output_str = String::from_utf8_lossy(&output.stdout);
            let lines: Vec<&str> = output_str.lines().collect();

            for line in lines {
                if line.contains(&format!(":{port}")) {
                    let pid = line
                        .split_whitespace()
                        .last()
                        .unwrap()
                        .parse::<u32>()
                        .expect("failed to parse PID");

                    if !pids.contains(&pid) {
                        pids.push(pid);
                    }
                }
            }
        } 
    #[cfg(target_os = "macos")]
    {
        let output = Command::new("lsof")
            .args(["-i", &format!(":{}", port)])
            .output()
            .expect("failed to execute lsof command");

        if output.status.success() {
            let output_str = String::from_utf8_lossy(&output.stdout);
            for line in output_str.lines().skip(1) {
                let cols: Vec<&str> = line.split_whitespace().collect();
                if cols.len() >= 2 {
                    if let Ok(pid) = cols[1].parse::<u32>() {
                        if !pids.contains(&pid) {
                            pids.push(pid);
                        }
                    }
                }
            }
        } else {
            println!("[check_port] failed to execute netstat command");
        }
    }

    pids
}
