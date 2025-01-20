import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function AdvancedPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Advanced")}>advanced</BasePage>;
}

export default AdvancedPage;
