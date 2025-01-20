import BasePage from "@/components/common/BasePage";
import { useTranslation } from "react-i18next";

function TaskActivePage() {
  const { t } = useTranslation();

  return <BasePage title={t("Task-Active")}>hello</BasePage>;
}

export default TaskActivePage;
