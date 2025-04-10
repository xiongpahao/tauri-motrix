import { Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title?: ReactNode; // the page title
  header?: ReactNode; // something behind title
  contentStyle?: React.CSSProperties;
  children?: ReactNode;
  full?: boolean;
  fab?: ReactNode; // floating action button
}

//isDark ? "#1e1f27" :
function BasePage({ title, header, children, contentStyle, full, fab }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <div className="base-page">
      <header>
        <Typography>{title}</Typography>
        {header}
      </header>

      <article
        className={full ? "base-container no-padding" : "base-container"}
      >
        <section
          style={{
            backgroundColor: isDark ? "#1e1f27" : "var(--background-color)",
          }}
        >
          <div className="base-content" style={contentStyle}>
            {children}
          </div>
          {fab}
        </section>
      </article>
    </div>
  );
}

export default BasePage;
