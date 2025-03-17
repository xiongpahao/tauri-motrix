import {
  CloseOutlined,
  FileOpenOutlined,
  InfoOutlined,
  LinkOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import BasePage from "@/components/BasePage";
import { useTask } from "@/hooks/task";

function TaskActivePage() {
  const { t } = useTranslation();

  const taskList = useTask("start");

  return (
    <BasePage
      title={t("Task-Start")}
      header={
        <Box>
          <IconButton size="small" title={t("Close All Tasks")}>
            <CloseOutlined />
          </IconButton>

          <IconButton size="small">
            <RefreshOutlined />
          </IconButton>

          <IconButton size="small">
            <PlayArrowOutlined />
          </IconButton>

          <IconButton size="small">
            <PauseOutlined />
          </IconButton>
        </Box>
      }
    >
      <List sx={{ bgcolor: "background.paper" }}>
        <ListItem
          secondaryAction={
            <Box>
              <IconButton size="small">
                <PlayArrowOutlined />
              </IconButton>

              <IconButton size="small" title={t("Close All Tasks")}>
                <CloseOutlined />
              </IconButton>

              <IconButton size="small">
                <FileOpenOutlined />
              </IconButton>

              <IconButton size="small">
                <LinkOutlined />
              </IconButton>

              <IconButton size="small">
                <InfoOutlined />
              </IconButton>
            </Box>
          }
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              // checked={checked.includes(value)}
              tabIndex={-1}
              disableRipple
              // inputProps={{ "aria-labelledby": labelId }}
            />
          </ListItemIcon>
          <ListItemText primary="文件名" secondary="进度25%" />
        </ListItem>
      </List>
    </BasePage>
  );
}

export default TaskActivePage;
