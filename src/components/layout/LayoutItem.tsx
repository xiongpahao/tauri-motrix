import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";

interface LayoutItemProps {
  children: string;
  to: string;
  icon: ReactNode;
}
function LayoutItem({ children, icon, to }: LayoutItemProps) {
  return (
    <ListItem>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText></ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

export default LayoutItem;
