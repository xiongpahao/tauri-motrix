import { styled, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title?: ReactNode; // the page title
  header?: ReactNode; // something behind title
  children?: ReactNode;
  full?: boolean;
  fab?: ReactNode; // floating action button
}

const ThePage = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
}));

const Header = styled("header")(() => ({
  userSelect: "none",
  flex: "0 0 58px",
  width: "100%",
  margin: "0 auto",
  padding: "0 20px",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid var(--divider-color)",
}));

const TheContainer = styled("article")<{ full?: boolean }>(
  ({ full, theme }) => ({
    width: "100%",
    height: "100%",
    overflow: full ? "visible" : "hidden",
    backgroundColor:
      theme.palette.mode === "dark" ? "#1e1f27" : "var(--background-color)",
    position: "relative",
    padding: full ? 0 : "10px",
    boxSizing: "border-box",
  }),
);

function BasePage({ title, header, children, full, fab }: Props) {
  return (
    <ThePage className="base-page">
      <Header data-tauri-drag-region>
        <Typography>{title}</Typography>
        {header}
      </Header>
      <TheContainer full={full}>
        {children}
        {fab}
      </TheContainer>
    </ThePage>
  );
}

export default BasePage;
