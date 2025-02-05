import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function TaskHistoryPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Task-History")}>111</BasePage>;
}

export default TaskHistoryPage;
