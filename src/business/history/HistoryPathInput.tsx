import { useState } from "react";

import DirPopover from "@/business/history/DirPopover";
import PathComboBox, { PathComboBoxProps } from "@/components/PathComboBox";

function HistoryPathInput(props: PathComboBoxProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  return (
    <>
      <PathComboBox
        {...props}
        onHistory={(e) => setAnchorEl(e.currentTarget)}
      />

      <DirPopover
        setDirValue={props.setValue}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(undefined)}
      />
    </>
  );
}

export default HistoryPathInput;
