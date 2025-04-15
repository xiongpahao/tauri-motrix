import { List, Paper, styled, SvgIcon, ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import { SWRConfig } from "swr";

import logoIcon from "@/assets/logo.svg?react";
import { useCustomTheme } from "@/hooks/theme";
import LayoutItem from "@/layout/LayoutItem";
import LayoutTraffic from "@/layout/LayoutTraffic";
import TitleBar from "@/layout/Titlebar";
import { routers } from "@/routes/application";

const Main = styled("main")(() => ({
  flex: "1 1 100%",
}));

const TheLogo = styled("section")(() => ({
  display: "flex",
  flex: "0 0 58px",
  justifyContent: "center",
  alignItems: "center",
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

const Aside = styled("aside")(() => ({
  display: "flex",
  flex: "1 0 200px",
  flexDirection: "column",
}));

function ApplicationLayout() {
  const { t } = useTranslation();
  const { theme } = useCustomTheme();

  const routerElements = useRoutes(routers);

  if (!routerElements) {
    return null;
  }

  return (
    <SWRConfig>
      <ThemeProvider theme={theme}>
        <Paper
          square
          sx={[
            ({ palette }) => ({
              bgcolor: palette.background.paper,
              height: "100vh",
              display: "grid",
              gridTemplateRows: "auto 1fr",
              gridAutoColumns: "auto 1fr",
              [`& > :nth-child(1)`]: {
                gridColumn: "1 / 3",
                gridRow: "1",
              },
              [`& > :nth-child(2)`]: {
                gridColumn: "1",
                gridRow: "2",
              },
              [`& > :nth-child(3)`]: {
                gridColumn: "2",
                gridRow: "2",
              },
            }),
          ]}
        >
          <TitleBar />

          <Aside>
            <TheLogo>
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
