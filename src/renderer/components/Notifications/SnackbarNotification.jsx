import { useState, useEffect } from "react";
import { Snackbar, Alert, AlertTitle, IconButton, Slide } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function SnackbarNotification({
  open,
  onClose,
  message,
  severity = "info",
  title,
  autoHideDuration = 6000,
  action,
}) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", minWidth: 300 }}
        action={
          action || (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarNotification;
