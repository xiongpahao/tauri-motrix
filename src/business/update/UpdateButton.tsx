import { Button } from "@mui/material";
import { useRef } from "react";

import { DialogRef } from "@/components/BaseDialog";

function UpdateButton() {
  const viewerRef = useRef<DialogRef>(null);

  return (
    <>
      <Button
        color="error"
        variant="contained"
        size="small"
        onClick={() => viewerRef.current?.open()}
      >
        New
      </Button>
    </>
  );
}

export default UpdateButton;
