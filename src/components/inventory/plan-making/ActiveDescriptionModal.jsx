import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ActiveDescriptionModal = ({ isOpen, onClose, descriptions, onCheckedDescriptionsChange }) => {
  const [checkedDescriptions, setCheckedDescriptions] = useState([]);

  const handleToggle = (description) => {
    setCheckedDescriptions((prev) => {
      const newChecked = prev.includes(description)
        ? prev.filter((desc) => desc !== description)
        : [...prev, description];
      onCheckedDescriptionsChange(newChecked); // Pass the updated checked descriptions to the parent
      return newChecked;
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setCheckedDescriptions([]); // Reset the checked descriptions when the modal is closed
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Active Descriptions
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <List>
          {descriptions
            ?.filter((description) => description.status === 'Active')
            .map((description, index) => (
              <ListItem key={index}>
                <Checkbox
                  edge="start"
                  checked={checkedDescriptions.includes(description.description)}
                  onChange={() => handleToggle(description.description)}
                />
                <ListItemText primary={description.description} />
              </ListItem>
            ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActiveDescriptionModal;
