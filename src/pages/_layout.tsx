import LayoutItem from "@/components/layout/LayoutItem";
import { routers } from "@/pages/_routers";
import { List, Paper, ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRoutes } from "react-router-dom";
import { SWRConfig } from "swr";

function Layout() {
  const { t } = useTranslation();

  const routerElements = useRoutes(routers);

  if (!routerElements) {
    return null;
  }

  return (
    <SWRConfig>
      <ThemeProvider theme={{}}>
        <Paper>
          <div>
            <List>
              {routers.map((router) => (
                <LayoutItem
                  icon={router.icon}
                  to={router.path}
                  key={router.label}
                >
                  {t(router.label)}
                </LayoutItem>
              ))}
            </List>
          </div>

          <div>{routerElements}</div>
        </Paper>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default Layout;
