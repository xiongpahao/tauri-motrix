interface Aria2Info {
  port: number;
  server: string;
}

interface Aria2Config {
  "save-session": string;

  "rpc-listen-all": string;

  "max-connection-per-server": string;

  "rpc-allow-origin-all": string;

  split: string;

  "enable-rpc": string;

  "input-file": string;

  dir: string;

  "rpc-listen-port": string;
}

interface MotrixConfig {
  aria2_engine: string;
  app_hide_window: boolean;
}
