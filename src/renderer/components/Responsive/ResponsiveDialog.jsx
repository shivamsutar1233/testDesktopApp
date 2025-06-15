import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import useResponsive from "../../hooks/useResponsive";

const ResponsiveDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
  ...props
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={isMobile ? fullScreen : false}
      sx={{
        "& .MuiDialog-paper": {
          margin: isMobile ? 0 : theme.spacing(2),
          maxHeight: isMobile ? "100vh" : "calc(100% - 64px)",
          borderRadius: isMobile ? 0 : theme.shape.borderRadius,
        },
        "& .MuiDialogContent-root": {
          padding: isMobile ? theme.spacing(2) : theme.spacing(3),
          overflowY: "auto",
          // Ensure proper spacing for form fields
          "& .MuiTextField-root": {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
          },
          "& .MuiFormControl-root": {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
          },
        },
        "& .MuiDialogActions-root": {
          padding: isMobile ? theme.spacing(2) : theme.spacing(2, 3),
          gap: theme.spacing(1),
        },
        "& .MuiDialogTitle-root": {
          padding: isMobile ? theme.spacing(2) : theme.spacing(2, 3),
          fontSize: isMobile ? "1.25rem" : "1.5rem",
        },
        ...props.sx,
      }}
      {...props}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default ResponsiveDialog;
