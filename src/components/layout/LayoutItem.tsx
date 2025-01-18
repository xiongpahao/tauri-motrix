import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutItemProps {
  children: string;
  to: string;
  icon: ReactNode;
}
function LayoutItem({ children, icon, to }: LayoutItemProps) {
  const navigate = useNavigate();

  return (
    <ListItem>
      <ListItemButton onClick={() => navigate(to)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

export default LayoutItem;
