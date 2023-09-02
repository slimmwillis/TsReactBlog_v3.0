import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  handleClose: () => void;
  editSubCategory?: any;
  addSubCategory: (subCategory: string) => void;
}

const AddSubCategoryDialog: React.FC<Props> = ({ editSubCategory, open, handleClose, addSubCategory }) => {
  const [subCategoryName, setSubCategoryName] = useState(editSubCategory ? editSubCategory : "");

  useEffect(() => {
    if (editSubCategory) {
      setSubCategoryName(editSubCategory)
    }
  }, [editSubCategory])
  const handleAddSubCategory = () => {
    addSubCategory(subCategoryName);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editSubCategory ? "Update Subcategory" : "Add Subcategory"}</DialogTitle>
      <DialogContent>
        <TextField
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Subcategory Name"
          type="text"
          fullWidth
          variant="standard"
          autoComplete={"off"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddSubCategory}>{editSubCategory ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubCategoryDialog;
