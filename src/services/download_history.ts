import { getMotrixDB } from "@/services/database";

export interface DownloadHistory {
  id: number;
  link: string;
  path: string;
  engine: DownloadEngine;
  name: string;
  created_at: number;
  updated_at: number;
}

export const enum DownloadEngine {
  Aria2 = "aria2c",
}

export async function addDownloadHistory(
  history: Omit<DownloadHistory, "id" | "created_at" | "updated_at">,
) {
  const db = await getMotrixDB();

  return await db.execute(
    "INSERT INTO download_history (link, path, engine, name) VALUES (?, ?, ?, ?)",
    [history.link, history.path, history.engine, history.name],
  );
}

export async function getDownloadHistory() {
  const db = await getMotrixDB();

  return await db.select<DownloadHistory[]>(
    "SELECT id, link, path, engine, name, created_at FROM download_history ORDER BY created_at DESC LIMIT 10",
  );
}
