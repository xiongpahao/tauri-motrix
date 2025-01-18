import { routers } from "@/_routers";
import { ThemeProvider } from "@mui/material";
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
        <div></div>
      </ThemeProvider>
    </SWRConfig>
  );
}

export default Layout;
