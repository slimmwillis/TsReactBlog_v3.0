import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  handleClose: () => void;
  addCategory: any;
  isEdit?: boolean;
  name?: any;
}

const AddCategoryDialog: React.FC<Props> = ({ isEdit, open, handleClose, addCategory, name, }) => {
  const [categoryName, setCategoryName] = React.useState(isEdit ? name : "");
  React.useEffect(() => {
    if (name)
      setCategoryName(name)
  }, [name])
  const handleAddCategory = () => {
    if (isEdit) {
      addCategory(categoryName);
    }
    else {
      addCategory(categoryName);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>


      <DialogTitle>{isEdit ? "Update Category" : "Add a new category"}</DialogTitle>
      <DialogContent>
        <TextField
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Category Name"
          type="text"
          fullWidth
          autoComplete={"off"}

          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddCategory}>{isEdit ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
