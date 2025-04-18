import {
  boxClasses,
  List,
  Paper,
  styled,
  SvgIcon,
  ThemeProvider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import { SWRConfig } from "swr";

import logoIcon from "@/assets/logo.svg?react";
import { useCustomTheme } from "@/hooks/theme";
import LayoutItem from "@/layout/LayoutItem";
import LayoutTraffic from "@/layout/LayoutTraffic";
import TitleBar from "@/layout/TitleBar";
import { routers } from "@/routes/application";

const TheLogo = styled("section")(() => ({
  display: "flex",
  flex: "0 0 58px",
  justifyContent: "center",
  alignItems: "center",
  appRegion: "drag",
}));

const TheMenu = styled(List)(() => ({
  flex: "1 1 80%",
}));

const TheTraffic = styled("section")(() => ({
  flex: "0 0 60px",
  "& > *": {
    paddingInline: "20px",
  },
}));

const Main = styled("main")(() => ({
  overflow: "hidden",
}));

const Aside = styled("aside")(({ theme }) => ({
  width: "200px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
}));

function ApplicationLayout() {
  const { t } = useTranslation();
  const { theme } = useCustomTheme();

  const routerElements = useRoutes(routers);

  if (!routerElements) {
    return null;
  }

  return (
    <SWRConfig value={{ errorRetryCount: 3 }}>
      <ThemeProvider theme={theme}>
        <Paper
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          sx={({ palette }) => ({
            bgcolor: palette.background.paper,
            height: "100vh",
            display: "grid",
            gridTemplateRows: "auto 1fr",
            gridAutoColumns: "auto 1fr",
            [`& > .${boxClasses.root}`]: {
              gridColumn: "1 / 3",
              gridRow: "1",
            },
            [`& > aside`]: {
              gridColumn: "1",
              gridRow: "2",
            },
            [`& > main`]: {
              gridColumn: "2",
              gridRow: "2",
            },
          })}
        >
          <TitleBar />

          <Aside>
            <TheLogo data-tauri-drag-region>
              <SvgIcon sx={{ width: 62 }} component={logoIcon} inheritViewBox />
            </TheLogo>

            <TheMenu>
              {routers.map(
                (router) =>
                  router.path &&
                  router.label && (
                    <LayoutItem
                      icon={router.icon}
                      to={router.path}
                      key={router.label}
                    >
                      {t(router.label)}
                    </LayoutItem>
                  ),
              )}
            </TheMenu>

            <TheTraffic>
              <LayoutTraffic />
            </TheTraffic>
          </Aside>

          <Main>{routerElements}</Main>
        </Paper>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default ApplicationLayout;
