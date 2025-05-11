import { useTranslation } from "react-i18next";

import HistoryItem, { DownloadEngine } from "@/business/history/HistoryItem";
import { TaskList } from "@/client/task_compose";
import BasePage from "@/components/BasePage";

function HistoryPage() {
  const { t } = useTranslation();

  const demo = {
    name: "filename",
    id: "1",
    link: "http://example.com",
    path: "C:/x/xxx/xx",
    engine: DownloadEngine.Aria2,
  };

  const onDelete = () => {
    throw new Error("Function not implemented.");
  };

  return (
    <BasePage title={t("Task-History")}>
      <TaskList
        emptyText="history.Empty"
        dataSource={[demo]}
        renderItem={({ engine, id, link, name, path }) => (
          <HistoryItem
            key={id}
            name={name}
            id={id}
            link={link}
            path={path}
            engine={engine}
            onDelete={onDelete}
          />
        )}
      />
    </BasePage>
  );
}

export default HistoryPage;
