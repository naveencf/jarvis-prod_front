import { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ActiveDescriptionModal = ({ isOpen, onClose, descriptions, onCheckedDescriptionsChange, checkedDescriptions, setCheckedDescriptions }) => {
  // Toggles the checked state of a specific description
  const handleToggle = (description) => {
    setCheckedDescriptions((prev) => {
      const newChecked = prev.includes(description) ? prev.filter((desc) => desc !== description) : [...prev, description];
      onCheckedDescriptionsChange(newChecked);
      return newChecked;
    });
  };

  // Selects all descriptions
  const handleAllActiveDescription = () => {
    const tempDescriptions = descriptions?.map((res) => res.description);
    setCheckedDescriptions(tempDescriptions);
  };


  // // Sync checkedDescriptions with the descriptions when the modal is opened
  // useEffect(() => {
  //   if (isOpen) {
  //     const activeDescriptions = descriptions
  //       ?.filter((description) => description.status === 'Active')
  //       .map((description) => description.description);
  //     setCheckedDescriptions(activeDescriptions); // Set checked descriptions based on active ones
  //   }
  // }, [isOpen, descriptions, setCheckedDescriptions]); // Only trigger when modal opens or descriptions change

  // const handleAllActiveDescription = () => {
  //   const tempDescription = descriptions
  //     ?.filter((res) => res.status === 'Active')
  //     .map((res) => res.description);
  //   setCheckedDescriptions(tempDescription); // Set all active descriptions
  // };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Checkbox edge="start" checked={checkedDescriptions.length > 0} onChange={() => handleAllActiveDescription()} />
        Notes
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <List>
          {descriptions
            ?.filter((description) => description.status === 'Active')
            .map((description, index) => (
              <ListItem key={index}>
                <Checkbox edge="start" checked={checkedDescriptions.includes(description.description)} onChange={() => handleToggle(description.description)} />
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
