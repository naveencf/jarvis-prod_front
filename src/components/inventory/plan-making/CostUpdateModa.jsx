import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

const CostUpdateModal = ({ isOpen, onClose, formData, onChange, onUpdate, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Costs</DialogTitle>
      <DialogContent>
        {[
          { label: "Operation Cost", name: "operation_cost" },
          { label: "Content Cost", name: "content_cost" },
          { label: "Twitter Trend Cost", name: "twitter_trend_cost" },
          { label: "UGC Video Cost", name: "ugc_video_cost" },
        ].map(({ label, name }) => (
          <TextField
            key={name}
            label={label}
            type="number"
            name={name}
            value={formData?.[name] || ""}
            onChange={onChange}
            fullWidth
            margin="dense"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onUpdate} disabled={isLoading} variant="contained" color="primary">
          Update
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CostUpdateModal;
