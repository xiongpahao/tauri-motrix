import { Box, Link, Typography } from "@mui/material";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useTranslation } from "react-i18next";

function CopyRight() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 2,
      }}
    >
      <Typography> &copy;{year} Motrix</Typography>

      <Link
        component="button"
        onClick={() =>
          openUrl(
            "https://raw.githubusercontent.com/Taoister39/tauri-motrix/refs/heads/main/LICENSE",
          )
        }
      >
        {t("about.License")}
      </Link>
      {/* <a target="_blank" rel="noopener noreferrer">
        {t("about.support")}
      </a>
      <a target="_blank" rel="noopener noreferrer">
        {t("about.release")}
      </a> */}
    </Box>
  );
}

export default CopyRight;
