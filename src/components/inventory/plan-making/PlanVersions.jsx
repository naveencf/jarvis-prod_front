import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography, Divider, Box } from '@mui/material';

const PlanVersions = ({ handleVersionClose, openVersionModal, versionDetails, onVersionSelect }) => {
  // Sort version details by version in ascending order
  const sortedDetails = versionDetails?.details?.length > 0 ? [...versionDetails.details].sort((a, b) => a.version - b.version) : [];
  return (
    <Dialog open={openVersionModal} onClose={handleVersionClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          py: 2,
        }}
      >
        Plan Versions
      </DialogTitle>
      <DialogTitle style={{ textAlign: 'center' }}>Total version : {sortedDetails?.length}</DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: '#fafafa',
          px: 4,
          py: 3,
        }}
      >
        {sortedDetails.length > 0 ? (
          <List sx={{ borderRadius: 2 }}>
            {sortedDetails.map((detail, index) => (
              <div key={index}>
                <ListItem
                  button
                  onClick={() => onVersionSelect(detail)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Version {detail.version}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                        Page Count: {detail.count}
                      </Typography>
                    }
                  />
                  <Button variant="contained" size="small" sx={{ alignSelf: 'center' }}>
                    Select
                  </Button>
                </ListItem>
                {index < sortedDetails.length - 1 && <Divider sx={{ my: 1 }} />}
              </div>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
              No version details available.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          py: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Button onClick={handleVersionClose} color="primary" variant="outlined" size="medium">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanVersions;
