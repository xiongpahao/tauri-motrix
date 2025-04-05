import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

function AddTaskModal({ onClose, open }: AddTaskModalProps) {
  const [downloadLink, setDownloadLink] = useState("");

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

        <Box sx={{ display: "flex", mt: 2, justifyContent: "end", gap: 2 }}>
          <Button variant="contained">Submit</Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTaskModal;
