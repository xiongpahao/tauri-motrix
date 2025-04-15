import { Box, Drawer, List, ListItem, ModalProps } from "@mui/material";

import { Aria2Task } from "@/services/aria2c_api";
import { getTaskName } from "@/utils/task";

export interface TaskItemDrawerProps {
  open: boolean;
  onClose: ModalProps["onClose"];
  task: Aria2Task;
}

function TaskItemDrawer({ open, onClose, task }: TaskItemDrawerProps) {
  const taskName = getTaskName(task);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: "400px" }} role="presentation">
        <List>
          <ListItem>GID: {task.gid}</ListItem>
          <ListItem>Task Name: {taskName}</ListItem>
          <ListItem>Save to: {task.dir}</ListItem>
          <ListItem>Status: {task.status}</ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default TaskItemDrawer;
