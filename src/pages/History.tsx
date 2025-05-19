import { useRequest } from "ahooks";
import { useTranslation } from "react-i18next";

import HistoryItem from "@/business/history/HistoryItem";
import { TaskList } from "@/client/task_compose";
import BasePage from "@/components/BasePage";
import { getDownloadHistory } from "@/services/download_history";

function HistoryPage() {
  const { t } = useTranslation();

  const { data: downloadHistoryList = [] } = useRequest(getDownloadHistory);

  const onDelete = () => {
    throw new Error("Function not implemented.");
  };

  return (
    <BasePage title={t("Task-History")}>
      <TaskList
        emptyText="history.Empty"
        dataSource={downloadHistoryList}
        renderItem={(item) => (
          <HistoryItem key={item.id} history={item} onDelete={onDelete} />
        )}
      />
    </BasePage>
  );
}

export default HistoryPage;
