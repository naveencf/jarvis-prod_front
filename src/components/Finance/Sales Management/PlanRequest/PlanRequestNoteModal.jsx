


import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PlanRequestNoteModal = ({
  isOpen,
  onClose,
  descriptions,
  onEdit,
  onDelete,
  onAdd,
  statusChange,
}) => {
  const [newDescription, setNewDescription] = useState('');

  const handleAddDescription = () => {
    if (newDescription.trim()) {
      onAdd(newDescription); // Trigger onAdd to add the new description
      setNewDescription(''); // Clear the input field
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
       Internal Notes For Plan Request
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* List of Descriptions */}
        <List>
          {descriptions?.map((description, index) => (
            <ListItem key={index}>
              <ListItemText primary={description?.description} />
              <div
                className={`badge ${
                  description?.status === 'Active'
                    ? 'badge-success'
                    : 'badge-danger'
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  statusChange(
                    index,
                    description?.status === 'Active' ? 'Inactive' : 'Active'
                  )
                }
              >
                {description?.status}
              </div>
              <div className="flexCenter colGap8 ml8">
                <button
                  title="edit"
                  className="icon"
                  onClick={() => onEdit(index)}
                >
                  <EditIcon />
                </button>
                <button
                  title="delete"
                  className="icon"
                  onClick={() => onDelete(index)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      {/* Add Description Section */}
      <DialogActions>
        <TextField
          label="New Description"
          variant="outlined"
          size="small"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button
          onClick={handleAddDescription}
          color="primary"
          variant="contained"
        >
          Add
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanRequestNoteModal;
