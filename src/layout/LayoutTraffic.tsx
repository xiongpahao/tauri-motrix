import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";
import { Box, styled, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

import { getGlobalStatApi } from "@/services/aria2c_api";
import { useTaskStore } from "@/store/task";
import { parseByteVo } from "@/utils/download";

const SpeedIndicatorRow = styled("section")(() => ({
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  "& .MuiSvgIcon-root": {
    mr: "8px",
    fontSize: 16,
  },
}));

const SpeedValue = styled(Typography)(() => ({
  flex: "1 1 56px",
  userSelect: "none",
  textAlign: "center",
}));

const SpeedUnit = styled(Typography)(() => ({
  flex: "0 1 27px",
  userSelect: "none",
  color: "grey.500",
  fontSize: "12px",
  textAlign: "right",
}));

function LayoutTraffic() {
  const { t } = useTranslation();
  const { updateInterval, interval } = useTaskStore();

  const { data: stat } = useSWR(
    "getGlobalStat",
    async () => {
      const globalStat = await getGlobalStatApi();
      updateInterval(globalStat);
      return globalStat;
    },
    { refreshInterval: interval },
  );

  const [up, upUnit] = parseByteVo(stat?.uploadSpeed, "/s");
  const [down, downUnit] = parseByteVo(stat?.downloadSpeed, "/s");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      <SpeedIndicatorRow title={t("UploadSpeed")}>
        <ArrowUpwardRounded color={+up > 0 ? "secondary" : "disabled"} />
        <SpeedValue color="secondary">{up}</SpeedValue>
        <SpeedUnit>{upUnit}</SpeedUnit>
      </SpeedIndicatorRow>

      <SpeedIndicatorRow title={t("DownloadSpeed")}>
        <ArrowDownwardRounded color={+down > 0 ? "primary" : "disabled"} />
        <SpeedValue color="primary">{down}</SpeedValue>
        <SpeedUnit>{downUnit}</SpeedUnit>
      </SpeedIndicatorRow>
    </Box>
  );
}

export default LayoutTraffic;
