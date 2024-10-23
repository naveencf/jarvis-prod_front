
import { useEffect } from 'react';
import Swal from 'sweetalert2';

const CustomAlert = ({
  title = 'Alert!',
  text = '',
  icon = 'info',
  confirmButtonText = 'OK',
  showCancelButton = false,
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
  showAlert, 
}) => {
  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        showCancelButton,
        cancelButtonText,
      }).then((result) => {
        if (result?.isConfirmed) {
          if (onConfirm) onConfirm();
        } else if (result?.isDismissed && onCancel) {
          onCancel();
        }
      });
    }
  }, [
    showAlert,
    title,
    text,
    icon,
    confirmButtonText,
    showCancelButton,
    cancelButtonText,
    onConfirm,
    onCancel,
  ]);

  return null; // No need to render anything as the alert is shown via useEffect
};

// this is for testing ci/cd

export default CustomAlert;
