import { AddOutlined } from "@mui/icons-material";
import {
  createTheme,
  Fab,
  List,
  Paper,
  SvgIcon,
  ThemeProvider,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import { SWRConfig } from "swr";

import logoIcon from "@/assets/logo.svg?react";
import AddTaskModal from "@/business/task/AddTaskModal";
import LayoutItem from "@/layout/LayoutItem";
import LayoutTraffic from "@/layout/LayoutTraffic";
import { routers } from "@/routes/application";

const theme = createTheme();

function ApplicationLayout() {
  const { t } = useTranslation();

  const [addModalOpen, setAddModalOpen] = useState(false);

  const routerElements = useRoutes(routers);

  if (!routerElements) {
    return null;
  }

  return (
    <SWRConfig>
      <ThemeProvider theme={theme}>
        <Paper
          className="layout"
          sx={[
            ({ palette }) => ({
              bgcolor: palette.background.paper,
            }),
          ]}
        >
          <div className="layout__left">
            <div className="the-logo" data-tauri-drag-region>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <SvgIcon
                  sx={{ width: 62 }}
                  component={logoIcon}
                  inheritViewBox
                />
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
                  ),
              )}
            </List>

            <div className="the-traffic">
              <LayoutTraffic />
            </div>
          </div>

          <div className="layout__right">
            {routerElements}

            <Fab
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              color="primary"
              onClick={() => setAddModalOpen(true)}
            >
              <AddOutlined />
            </Fab>
          </div>

          <AddTaskModal
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
          />
        </Paper>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default ApplicationLayout;
