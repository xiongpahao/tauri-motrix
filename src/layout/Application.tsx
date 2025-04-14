import {
  Box,
  createTheme,
  List,
  styled,
  SvgIcon,
  ThemeProvider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import { SWRConfig } from "swr";

import logoIcon from "@/assets/logo.svg?react";
import LayoutItem from "@/layout/LayoutItem";
import LayoutTraffic from "@/layout/LayoutTraffic";
import { routers } from "@/routes/application";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

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

  const routerElements = useRoutes(routers);

  if (!routerElements) {
    return null;
  }

  return (
    <SWRConfig>
      <ThemeProvider theme={theme}>
        <Box
          sx={[
            ({ palette }) => ({
              bgcolor: palette.background.paper,
              display: "flex",
              width: "100%",
              height: "100vh",
            }),
          ]}
        >
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
        </Box>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default ApplicationLayout;
