import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";
import { Box, SxProps, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

import { getGlobalStatApi } from "@/services/aria2c_api";
import parseTraffic from "@/utils/download";

const boxSx: SxProps = {
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
};

const iconSx: SxProps = {
  mr: "8px",
  fontSize: 16,
};
const valSx: SxProps = {
  flex: "1 1 56px",
  userSelect: "none",
  textAlign: "center",
};
const unitSx: SxProps = {
  flex: "0 1 27px",
  userSelect: "none",
  color: "grey.500",
  fontSize: "12px",
  textAlign: "right",
};

function LayoutTraffic() {
  const { t } = useTranslation();
  const { data: globalStat } = useSWR("getGlobalStat", getGlobalStatApi, {
    refreshInterval: 1000,
  });

  const [up, upUnit] = parseTraffic(Number(globalStat?.uploadSpeed));
  const [down, downUnit] = parseTraffic(Number(globalStat?.downloadSpeed));

  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      <Box title={t("UploadSpeed")} sx={boxSx}>
        <ArrowUpwardRounded
          sx={iconSx}
          color={+up > 0 ? "secondary" : "disabled"}
        />
        <Typography sx={valSx} color="secondary">
          {up}
        </Typography>
        <Typography sx={unitSx}>{upUnit}/s</Typography>
      </Box>
      <Box title={t("DownloadSpeed")} sx={boxSx}>
        <ArrowDownwardRounded
          sx={iconSx}
          color={+down > 0 ? "primary" : "disabled"}
        />
        <Typography color="primary" sx={valSx}>
          {down}
        </Typography>
        <Typography sx={unitSx}>{downUnit}/s</Typography>
      </Box>
    </Box>
  );
}

export default LayoutTraffic;
