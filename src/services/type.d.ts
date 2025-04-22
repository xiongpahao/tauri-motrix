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
  language: string;
  app_log_level: "silent" | "error" | "warn" | "info" | "debug" | "trace";
  theme_mode: "light" | "dark" | "system";
  auto_log_clean: 0 | 1 | 2 | 3;
}

interface Aria2Option {
  "allow-overwrite": string;
  "allow-piece-length-change": string;
  "always-resume": string;
  "async-dns": string;
  "auto-file-renaming": string;
  "bt-enable-hook-after-hash-check": string;
  "bt-enable-lpd": string;
  "bt-force-encryption": string;
  "bt-hash-check-seed": string;
  "bt-load-saved-metadata": string;
  "bt-max-peers": string;
  "bt-metadata-only": string;
  "bt-min-crypto-level": string;
  "bt-remove-unselected-file": string;
  "bt-request-peer-speed-limit": string;
  "bt-require-crypto": string;
  "bt-save-metadata": string;
  "bt-seed-unverified": string;
  "bt-stop-timeout": string;
  "bt-tracker-connect-timeout": string;
  "bt-tracker-interval": string;
  "bt-tracker-timeout": string;
  "check-integrity": string;
  "conditional-get": string;
  "connect-timeout": string;
  "content-disposition-default-utf8": string;
  continue: string;
  dir: string;
  "dry-run": string;
  "enable-http-keep-alive": string;
  "enable-http-pipelining": string;
  "enable-mmap": string;
  "enable-peer-exchange": string;
  "file-allocation": string;
  "follow-metalink": string;
  "follow-torrent": string;
  "force-save": string;
  "ftp-pasv": string;
  "ftp-reuse-connection": string;
  "ftp-type": string;
  "hash-check-only": string;
  "http-accept-gzip": string;
  "http-auth-challenge": string;
  "http-no-cache": string;
  "lowest-speed-limit": string;
  "max-connection-per-server": string;
  "max-download-limit": string;
  "max-file-not-found": string;
  "max-mmap-limit": string;
  "max-resume-failure-tries": string;
  "max-tries": string;
  "max-upload-limit": string;
  "metalink-enable-unique-protocol": string;
  "metalink-preferred-protocol": string;
  "min-split-size": string;
  "no-file-allocation-limit": string;
  "no-netrc": string;
  "no-want-digest-header": string;
  out: string;
  "parameterized-uri": string;
  "pause-metadata": string;
  "piece-length": string;
  "proxy-method": string;
  "realtime-chunk-checksum": string;
  "remote-time": string;
  "remove-control-file": string;
  "retry-wait": string;
  "reuse-uri": string;
  "rpc-save-upload-metadata": string;
  "save-not-found": string;
  "seed-ratio": string;
  split: string;
  "stream-piece-selector": string;
  timeout: string;
  "uri-selector": string;
  "use-head": string;
  "user-agent": string;
}
