import { Box, List, Popover, PopoverProps } from "@mui/material";
import useSWR from "swr";

import { HistoryDirItem } from "@/client/history_compose";
import { BaseEmpty } from "@/components/BaseEmpty";
import {
  deleteDir,
  findManyDir,
  SaveToHistory,
  updateDir,
} from "@/services/save_to_history";

export interface DirPopoverProps {
  anchorEl?: HTMLButtonElement;
  onClose?: PopoverProps["onClose"];
  setDirValue?: (value: string) => void;
}

function DirPopover({ anchorEl, onClose, setDirValue }: DirPopoverProps) {
  const { data: dirHistoryList } = useSWR("getSaveToHistory", findManyDir);

  const open = Boolean(anchorEl);
  const id = open ? "business-dir-popover" : undefined;

  const renderItem = (item: SaveToHistory) => {
    const is_star = item.is_star === 1;
    return (
      <HistoryDirItem
        dir={item.dir}
        onSelect={() => setDirValue?.(item.dir)}
        onDelete={deleteDir}
        onStar={(id) =>
          updateDir(id, {
            is_star,
          })
        }
        id={item.id}
        key={item.id}
        is_star={is_star}
      />
    );
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      {!dirHistoryList?.length ? (
        <Box sx={{ p: 2 }}>
          <BaseEmpty />
        </Box>
      ) : (
        <List disablePadding>{dirHistoryList.map(renderItem)}</List>
      )}
    </Popover>
  );
}

export default DirPopover;
