import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function SettingsPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Settings")}>111</BasePage>;
}

export default SettingsPage;
