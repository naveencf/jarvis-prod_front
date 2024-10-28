import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { baseUrl } from '../../../utils/config';
import Swal from 'sweetalert2';

export default function PlanXStatusDialog({ setPlanDetails, statusDialogPlan, statusDialog, setStatusDialog, fetchPlans }) {
    const storedToken = sessionStorage.getItem('token');
    const handleClose = () => {
        setStatusDialog(false);
    };
    const handleUpdate = async () => {
        const planData = {
            id: statusDialogPlan?.id,
            plan_status: statusDialogPlan?.plan_status == 'close' ? 'draft' : 'close',

        };
        try {
            const method = 'PUT';
            const response = await fetch(`${baseUrl}v1/planxlogs`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedToken}`,
                },
                body: JSON.stringify(planData),
            });

            const result = await response.json();
            // console.log(result, "result");

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Status updated successfully!',

                });
                fetchPlans();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to save plan',
                    text: result.message,
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Something went wrong. Please try again later.',
            });
        }
        setStatusDialog(false);
    };

    return (
        <>

            <Dialog
                open={statusDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Updating status for : ${statusDialogPlan?.account_name} Plan?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure to update status of {statusDialogPlan?.planName} from {statusDialogPlan?.plan_status} to {statusDialogPlan?.plan_status == 'close' ? 'draft' : 'close'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpdate} autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
