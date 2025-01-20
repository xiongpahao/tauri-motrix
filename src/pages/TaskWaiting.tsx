import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function TaskWaitingPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Task-Waiting")}>111</BasePage>;
}

export default TaskWaitingPage;
