import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

import { addTaskApi } from "@/services/aria2c_api";
import { getAria2Info } from "@/services/cmd";

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

function AddTaskModal({ onClose, open }: AddTaskModalProps) {
  const [downloadLink, setDownloadLink] = useState("");

  const { data: aria2Info } = useSWR("getAria2Info", getAria2Info);

  const onSubmit = () => {
    if (!downloadLink) {
      return;
    }

    addTaskApi(downloadLink).then((res) => {
      console.log("addTaskApi", res);
    });

    setDownloadLink("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          pt: 2,
          px: 4,
          pb: 3,
        }}
      >
        <TextField
          label="Download Link"
          fullWidth
          onChange={(e) => setDownloadLink(e.target.value)}
          value={downloadLink}
        />

        <TextField
          label="Download Path"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!aria2Info?.dir}
          defaultValue={aria2Info?.dir}
        />

        <Box sx={{ display: "flex", mt: 2, justifyContent: "end", gap: 2 }}>
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;
