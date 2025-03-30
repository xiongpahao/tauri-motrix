import { useTranslation } from "react-i18next";

import BasePage from "@/components/BasePage";

function TaskStoppedPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Task-Done")}>222</BasePage>;
}

export default TaskStoppedPage;
