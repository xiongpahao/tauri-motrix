import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import { SWRConfig } from "swr";
import { List, Paper, SvgIcon, ThemeProvider } from "@mui/material";

import LayoutItem from "@/components/layout/LayoutItem";
import { routers } from "@/pages/_routers";
import logoIcon from "@/assets/logo.svg?react";

function Layout() {
  const { t } = useTranslation();

  const routerElements = useRoutes(routers);

  if (!routerElements) {
    return null;
  }

  return (
    <SWRConfig>
      <ThemeProvider theme={{}}>
        <Paper className="layout">
          <div className="layout__left">
            <div className="the-logo" data-tauri-drag-region="true">
              <div
                style={{
                  height: "27px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <SvgIcon
                  component={logoIcon}
                  style={{
                    height: "24px",
                    width: "62px",
                    marginTop: "-3px",
                    marginRight: "5px",
                    marginLeft: "-3px",
                  }}
                  inheritViewBox
                />
                <span>Motrix</span>
              </div>
            </div>

            <List className="the-menu">
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
                  )
              )}
            </List>
          </div>

          <div className="layout__right">{routerElements}</div>
        </Paper>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default Layout;
