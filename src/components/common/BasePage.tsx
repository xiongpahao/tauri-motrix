import { Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title?: ReactNode; // the page title
  header?: ReactNode; // something behind title
  contentStyle?: React.CSSProperties;
  children?: ReactNode;
  full?: boolean;
}

//isDark ? "#1e1f27" :
function BasePage({ title, header, children, contentStyle }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <div className="base-page">
      <header data-tauri-drag-region="true" style={{ userSelect: "none" }}>
        <Typography
          sx={{ fontSize: "20px", fontWeight: "700 " }}
          data-tauri-drag-region="true"
        >
          {title}
        </Typography>

        {header}
      </header>

      <div className="base-container" style={{ backgroundColor: "#ffffff" }}>
        <section
          style={{
            backgroundColor: isDark ? "#1e1f27" : "var(--background-color)",
          }}
        >
          <div className="base-content" style={contentStyle}>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BasePage;
