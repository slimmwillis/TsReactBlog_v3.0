import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthContext, AuthContextType } from '../context/AuthContext';

interface Props {
  open: boolean;
  handleClose: () => void;
  addPost: (post: string) => void;
}

const AddPostDialog: React.FC<Props> = ({ open, handleClose, addPost }) => {
  const { admin } = useContext(AuthContext) as AuthContextType;

  const [postName, setPostName] = useState('');

  const handleAddPost = () => {
    addPost(postName);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a new post</DialogTitle>
      <DialogContent>
        <TextField
          value={postName}
          onChange={(e) => setPostName(e.target.value)}
          autoFocus
          margin="dense"
          id="name"
          label="Post Name"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      {admin && (
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddPost}>Add Post</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AddPostDialog;
