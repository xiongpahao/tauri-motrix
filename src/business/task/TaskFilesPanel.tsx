import { Box } from "@mui/material";
import { useMergedState } from "rc-util";
import { Key, useMemo } from "react";

import TaskFiles from "@/business/task/TaskFiles";
import ConfirmPanel from "@/components/ConfirmPanel";
import { Aria2Task } from "@/services/aria2c_api";
import { getFileExtension, getFileName } from "@/utils/file";

function TaskFilesPanel(props: { task: Aria2Task }) {
  const { task } = props;

  const fileList = useMemo(() => {
    const result = task.files.map((item) => {
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
    // merge(cached.files, result);
    return result;
  }, [task.files]);

  const defaultSelectedRowKeys = useMemo(
    () => fileList.filter((item) => item.selected).map((item) => item.idx),
    [fileList],
  );

  const [selectedKeys, setSelectedKeys] = useMergedState<Key[]>(
    defaultSelectedRowKeys,
  );

  return (
    <ConfirmPanel
      open={
        JSON.stringify(defaultSelectedRowKeys) !== JSON.stringify(selectedKeys)
      }
    >
      <TaskFiles
        files={fileList}
        mode="DETAIL"
        key="idx"
        selectedRowKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys)}
      />
    </ConfirmPanel>
  );
}

export default TaskFilesPanel;
