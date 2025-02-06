import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function TaskRecyclePage() {
  const { t } = useTranslation();

  return <BasePage title={t("Recycle")}>Recycle</BasePage>;
}

export default TaskRecyclePage;
