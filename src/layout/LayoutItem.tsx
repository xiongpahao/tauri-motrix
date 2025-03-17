import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";

interface LayoutItemProps {
  children: string;
  to: string;
  icon: ReactNode;
}
function LayoutItem({ children, icon, to }: LayoutItemProps) {
  const navigate = useNavigate();

  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <ListItem>
      <ListItemButton selected={!!match} onClick={() => navigate(to)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{children}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}

export default LayoutItem;
