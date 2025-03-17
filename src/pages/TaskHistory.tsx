import { useTranslation } from "react-i18next";

import BasePage from "@/components/BasePage";

function TaskHistoryPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Task-History")}>111</BasePage>;
}

export default TaskHistoryPage;
