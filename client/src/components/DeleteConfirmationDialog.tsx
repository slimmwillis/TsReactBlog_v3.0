import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Button } from "react-bootstrap";
import { styled } from "@mui/material/styles";

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "black",
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.error.dark,
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  onRemove: () => Promise<void>;
  title: string;
  content: string;
}

const DeleteConfirmationDialog: React.FC<Props> = ({
  open,
  onClose,
  onRemove,
  title,
  content,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "8px" } }}
    >
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <StyledDeleteButton onClick={onRemove} autoFocus>
          Delete
        </StyledDeleteButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
