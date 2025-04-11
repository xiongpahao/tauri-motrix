import { ChevronRightRounded } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { ReactNode, useState } from "react";

interface ItemProps {
  label: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  secondary?: ReactNode;
  onClick?: () => void;
}

export function SettingItem(props: ItemProps) {
  const { label, extra, children, secondary, onClick } = props;
  const clickable = !!onClick;

  const primary = (
    <Box sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
      <span>{label}</span>
      {extra ? extra : null}
    </Box>
  );

  const [isLoading] = useState(false);
  const handleClick = () => {
    // TODO
  };

  if (clickable) {
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={handleClick} disabled={isLoading}>
          <ListItemText primary={primary} secondary={secondary} />
          {isLoading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <ChevronRightRounded />
          )}
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem sx={{ pt: "5px", pb: "5px", display: "inline-flex", gap: 2 }}>
      <ListItemText primary={primary} secondary={secondary} />
      {children}
    </ListItem>
  );
}

export function SettingList(props: { title: string; children: ReactNode }) {
  return (
    <List>
      <ListSubheader
        sx={[
          { background: "transparent", fontSize: "16px", fontWeight: "700" },
          ({ palette }) => {
            return {
              color: palette.text.primary,
            };
          },
        ]}
        disableSticky
      >
        {props.title}
      </ListSubheader>

      {props.children}
    </List>
  );
}
