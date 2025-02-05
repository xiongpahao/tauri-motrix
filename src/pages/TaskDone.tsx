import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function TaskStoppedPage() {
  const { t } = useTranslation();

  return <BasePage title={t("Task-Done")}>222</BasePage>;
}

export default TaskStoppedPage;
