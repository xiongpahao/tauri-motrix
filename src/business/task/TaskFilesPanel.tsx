import { Key, useCallback, useMemo, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import TaskFiles from "@/business/task/TaskFiles";
import ConfirmPanel from "@/components/ConfirmPanel";
import { Notice } from "@/components/Notice";
import { Aria2Task, changeOptionApi } from "@/services/aria2c_api";
import { useTaskStore } from "@/store/task";
import { getFileExtension, getFileName } from "@/utils/file";

export interface TaskFilesPanelProps {
  task: Aria2Task;
}

function TaskFilesPanel({ task }: TaskFilesPanelProps) {
  const { t } = useTranslation();
  const fetchItem = useTaskStore((state) => state.fetchItem);

  const fileList = useMemo(() => {
    return task.files.map((item) => {
      const name = getFileName(item.path);
      const extension = getFileExtension(name);
      return {
        idx: Number(item.index),
        selected: item.selected === "true",
        path: item.path,
        name,
        extension: `.${extension}`,
        length: parseInt(item.length, 10),
        completedLength: +item.completedLength,
      };
    });
  }, [task.files]);

  const defaultSelectedRowKeys = useMemo(
    () => fileList.filter((item) => item.selected).map((item) => item.idx),
    [fileList],
  );

  const [selectedKeys, setSelectedKeys] = useState<Key[]>(
    defaultSelectedRowKeys,
  );

  const isHideConfirm = useMemo(
    () => defaultSelectedRowKeys.join(",") === selectedKeys.join(","),
    [defaultSelectedRowKeys, selectedKeys],
  );

  const [loading, startTransition] = useTransition();

  const handleChangeFile = useCallback(async () => {
    if (selectedKeys.length === 0) {
      Notice.info(t("task.SelectAtLeastOne"));
      return;
    }

    const option = {
      "select-file": selectedKeys.join(","),
    };

    await changeOptionApi(task.gid, option);

    await fetchItem(task.gid);
  }, [fetchItem, selectedKeys, t, task.gid]);

  return (
    <ConfirmPanel
      hide={isHideConfirm}
      onCancel={() => setSelectedKeys(defaultSelectedRowKeys)}
      onOk={() => startTransition(handleChangeFile)}
      loading={loading}
    >
      <TaskFiles
        files={fileList}
        mode="DETAIL"
        rowKey="idx"
        selectedRowKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys)}
      />
    </ConfirmPanel>
  );
}

export default TaskFilesPanel;
