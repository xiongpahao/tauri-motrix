import {
  DeleteOutline,
  FileOpenOutlined,
  Folder,
  LinkOutlined,
} from "@mui/icons-material";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  listItemIconClasses,
  ListItemText,
  typographyClasses,
} from "@mui/material";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TaskActionButton } from "@/client/task_compose";
import { Notice } from "@/components/Notice";
import { DownloadHistoryVO } from "@/services/download_history";
import { parseByteVo } from "@/utils/download";

export interface HistoryItemProps {
  history: DownloadHistoryVO;
  onDelete: (id: DownloadHistoryVO["id"]) => void;
  onSelect: (id: DownloadHistoryVO["id"]) => void;
}

function HistoryItem({ history, onDelete, onSelect }: HistoryItemProps) {
  const { engine, id, link, name, path, downloaded_at, total_length } = history;

  const { t } = useTranslation();

  const describe = useMemo(
    () =>
      `${engine} ${parseByteVo(total_length).join("")} ${dayjs.unix(downloaded_at).format("YYYY-MM-DD HH:mm:ss")}`,
    [engine, downloaded_at, total_length],
  );

  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={({ palette }) => ({
          bgcolor: palette.background.paper,
          ":hover": { bgcolor: palette.background.paper },
          borderRadius: "8px",
          [`& .${listItemIconClasses.root}`]: {
            minWidth: "40px",
          },
        })}
        onClick={() => onSelect(id)}
      >
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText
          sx={{
            display: "table",
            tableLayout: "fixed",
            width: "100%",
            [`& .${typographyClasses.body1}`]: {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            },
          }}
          primary={name}
          secondary={describe}
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TaskActionButton
            icon={<LinkOutlined />}
            onClick={() => writeText(link)}
          />
          <TaskActionButton
            title={t("task.OpenFile")}
            icon={<FileOpenOutlined />}
            onClick={() => revealItemInDir(path).catch((e) => Notice.error(e))}
          />
          <TaskActionButton
            icon={<DeleteOutline />}
            onClick={() => onDelete(id)}
          />
        </Box>
      </ListItemButton>
    </ListItem>
  );
}

export default HistoryItem;
