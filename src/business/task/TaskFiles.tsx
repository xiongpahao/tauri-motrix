import { Article, MusicNote, Photo, Theaters } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonProps,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { Instance } from "parse-torrent";
import { useMergedState } from "rc-util";
import { Key, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import useLazyKVMap, { GetRowKey } from "@/hooks/lazy_kv_map";
import { calcProgress, parseByteVo } from "@/utils/download";
import {
  filterAudioFiles,
  filterDocumentFiles,
  filterImageFiles,
  filterVideoFiles,
} from "@/utils/file";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export type TaskFile = NonNullable<Instance["files"]>[number] & {
  idx: number;
  extension: string;
  completedLength?: number;
};

export interface TaskFilesProps {
  mode?: "DETAIL";
  files?: TaskFile[];
  rowKey?: string;
  selectedRowKeys?: Key[];
  defaultSelectedRowKeys?: Key[];
  onSelectionChange?: (
    keys: Key[],
    record: unknown,
    info: { type: RowSelectMethod },
  ) => void;
}

export type RowSelectMethod = "all" | "none" | "invert" | "single" | "multiple";

export const enum FILE_SELECTION {
  Video = "video",
  Audio = "audio",
  Image = "image",
  Document = "document",
}

export default function TaskFiles({
  files,
  rowKey = "path",
  defaultSelectedRowKeys,
  selectedRowKeys,
  onSelectionChange,
  mode,
}: TaskFilesProps) {
  const { t } = useTranslation();

  const [toggleFileType, setToggleFileType] = useState<
    FILE_SELECTION | undefined
  >();

  const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(
    selectedRowKeys || defaultSelectedRowKeys || [],
    {
      value: selectedRowKeys,
    },
  );

  const rawData: readonly TaskFile[] = useMemo(() => files || [], [files]);

  const getRowKey = useMemo<GetRowKey<TaskFile>>(() => {
    if (typeof rowKey === "function") {
      return rowKey;
    }

    return (record: TaskFile, index) =>
      record?.[rowKey as keyof TaskFile] || `default_${index}`;
  }, [rowKey]);

  const derivedSelectedKeySet = useMemo<Set<Key>>(
    () => new Set(mergedSelectedKeys),
    [mergedSelectedKeys],
  );

  const fileSelections = useMemo(
    () =>
      [
        {
          icon: <Theaters />,
          value: FILE_SELECTION.Video,
        },
        {
          icon: <MusicNote />,
          value: FILE_SELECTION.Audio,
        },
        {
          icon: <Photo />,
          value: FILE_SELECTION.Image,
        },
        {
          icon: <Article />,
          value: FILE_SELECTION.Document,
        },
      ] as const,
    [],
  );

  const [getRecordByKey] = useLazyKVMap<TaskFile>(
    rawData,
    "children",
    getRowKey,
  );

  const setSelectedKeys = useCallback(
    (keys: Key[], method: RowSelectMethod) => {
      const availableKeys: Key[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const records: any[] = [];

      // Filter key which not exist in the `dataSource`
      keys.forEach((key) => {
        const record = getRecordByKey(key);
        if (record !== undefined) {
          availableKeys.push(key);
          records.push(record);
        }
      });

      setMergedSelectedKeys(availableKeys);
      onSelectionChange?.(availableKeys, records, { type: method });
    },
    [getRecordByKey, onSelectionChange, setMergedSelectedKeys],
  );

  const onSelectAllChange = useCallback(() => {
    const keySet = new Set(derivedSelectedKeySet);

    // Record key only need check with enabled
    const recordKeys = rawData.map(getRowKey);
    const checkedCurrentAll = recordKeys.every((key) => keySet.has(key));
    const changeKeys: Key[] = [];

    if (checkedCurrentAll) {
      recordKeys.forEach((key) => {
        keySet.delete(key);
        changeKeys.push(key);
      });
    } else {
      recordKeys.forEach((key) => {
        if (!keySet.has(key)) {
          keySet.add(key);
          changeKeys.push(key);
        }
      });
    }

    const keys = Array.from(keySet);

    setSelectedKeys(keys, "all");
    setToggleFileType(undefined);
  }, [derivedSelectedKeySet, rawData, getRowKey, setSelectedKeys]);

  const handleToggleFile = useCallback<
    NonNullable<ToggleButtonProps["onChange"]>
  >(
    (_, value) => {
      setToggleFileType(value);

      if (!value) {
        return;
      }

      let filtered: TaskFile[] = [];

      const variableRawData = Array.from(rawData);

      switch (value) {
        case FILE_SELECTION.Audio:
          filtered = filterAudioFiles(variableRawData);
          break;

        case FILE_SELECTION.Video:
          filtered = filterVideoFiles(variableRawData);
          break;

        case FILE_SELECTION.Image:
          filtered = filterImageFiles(variableRawData);
          break;

        case FILE_SELECTION.Document:
          filtered = filterDocumentFiles(variableRawData);
          break;
      }

      const newKeys = filtered.map(getRowKey);
      setSelectedKeys(newKeys, "multiple");
    },
    [getRowKey, rawData, setSelectedKeys],
  );

  const renderCell = (key: Key, record: TaskFile, index: number) => {
    const checked = derivedSelectedKeySet.has(key);

    return (
      <StyledTableRow key={index}>
        <StyledTableCell component="th" scope="row">
          <Checkbox
            size="small"
            checked={checked}
            onChange={() => {
              const keySet = new Set(derivedSelectedKeySet);

              if (checked) {
                keySet.delete(key);
              } else {
                keySet.add(key);
              }
              const keys = Array.from(keySet);

              setSelectedKeys(keys, "single");
              setToggleFileType(undefined);
            }}
          />
        </StyledTableCell>
        <StyledTableCell sx={{ textOverflow: "ellipsis" }}>
          {record.name}
        </StyledTableCell>
        {mode === "DETAIL" && (
          <>
            <StyledTableCell align="right" width={50}>
              {calcProgress(record.length, record.completedLength || 0, 1)}
            </StyledTableCell>

            <StyledTableCell align="right" width={85}>
              {parseByteVo(record.completedLength).join("")}
            </StyledTableCell>
          </>
        )}
        <StyledTableCell>{record.extension}</StyledTableCell>
        <StyledTableCell align="right">
          {parseByteVo(record.length).join("")}
        </StyledTableCell>
      </StyledTableRow>
    );
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Checkbox
                  checked={mergedSelectedKeys.length === rawData.length}
                  sx={(theme) => ({
                    color: theme.palette.common.white,
                    "&.Mui-checked": {
                      color: theme.palette.common.white,
                    },
                  })}
                  onChange={onSelectAllChange}
                />
              </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Extension</StyledTableCell>

              {mode === "DETAIL" && (
                <>
                  <StyledTableCell align="right" width={50}>
                    %
                  </StyledTableCell>

                  <StyledTableCell align="right" width={85}>
                    ✓
                  </StyledTableCell>
                </>
              )}
              <StyledTableCell align="right">
                {t("task.FileSize")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawData.map((record, index) =>
              renderCell(getRowKey(record, index), record, index),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, alignItems: "center" }}
        columns={24}
      >
        <Grid
          size={{
            xs: 24,
            sm: 8,
            md: 8,
            lg: 8,
          }}
        >
          <ToggleButtonGroup
            size="small"
            value={toggleFileType}
            onChange={handleToggleFile}
            exclusive
            color="primary"
          >
            {fileSelections.map(({ icon, value }) => (
              <ToggleButton value={value} key={value}>
                {icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid
          size={{
            xs: 24,
            sm: 16,
            md: 16,
            lg: 16,
          }}
        >
          {t("task.SelectedFilesSum", {
            selectedFilesCount: mergedSelectedKeys.length,
            selectedFilesTotalSize: rawData.length,
          })}
        </Grid>
      </Grid>
    </Box>
  );
}
