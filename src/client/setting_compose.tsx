import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { ReactNode } from "react";

export function SettingItem(props: {
  label: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  secondary?: ReactNode;
}) {
  const { label, extra, children, secondary } = props;

  const primary = (
    <Box sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
      <span>{label}</span>
      {extra ? extra : null}
    </Box>
  );

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
