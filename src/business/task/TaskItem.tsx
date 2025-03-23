import {
  CloseOutlined,
  FileOpenOutlined,
  InfoOutlined,
  LinkOutlined,
  PlayArrowOutlined,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function TaskItem() {
  const { t } = useTranslation();

  return (
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
      <ListItemText primary="filename" secondary="process 25%" />
    </ListItem>
  );
}

export default TaskItem;
