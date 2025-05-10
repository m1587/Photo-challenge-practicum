// components/ui/Success.tsx
import { Snackbar, Alert } from "@mui/material";

interface SuccessSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const SuccessSnackbar = ({ open, onClose, message }: SuccessSnackbarProps) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
    <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default SuccessSnackbar;
