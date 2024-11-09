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

const ActiveDescriptionModal = ({ isOpen, onClose, descriptions, onCheckedDescriptionsChange, checkedDescriptions, setCheckedDescriptions }) => {
  // const [checkedDescriptions, setCheckedDescriptions] = useState([]);
  // console.log(descriptions, 'descriptions')

  const handleToggle = (description) => {
    setCheckedDescriptions((prev) => {
      const newChecked = prev.includes(description)
        ? prev.filter((desc) => desc !== description)
        : [...prev, description];
      onCheckedDescriptionsChange(newChecked); // Pass the updated checked descriptions to the parent
      return newChecked;
    });
  };

  // useEffect(() => {
  //   if (!isOpen) {
  //     setCheckedDescriptions([]); // Reset the checked descriptions when the modal is closed
  //   }
  // }, [isOpen]);

  const handleAllActiveDescription = () => {
    const tempDescription = descriptions?.map(res => res.description)
    // console.log(tempDescription, 'tempDescription')
    setCheckedDescriptions(tempDescription);
  }
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Checkbox
          edge="start"
          checked={checkedDescriptions.length > 0 ? true : false}
          onChange={() => handleAllActiveDescription()}
        />
        Notes
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
