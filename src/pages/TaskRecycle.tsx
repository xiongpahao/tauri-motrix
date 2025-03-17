import { useTranslation } from "react-i18next";

import BasePage from "@/components/BasePage";

function TaskRecyclePage() {
  const { t } = useTranslation();

  return <BasePage title={t("Recycle")}>Recycle</BasePage>;
}

export default TaskRecyclePage;
