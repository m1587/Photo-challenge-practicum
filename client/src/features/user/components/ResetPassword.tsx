import { useState } from "react"
import { 
  Button, 
  Modal, 
  TextField, 
  Typography, 
  Paper, 
  InputAdornment,
  CircularProgress,
  Alert
} from "@mui/material"
import { AlternateEmail, ArrowBack } from "@mui/icons-material"
import ErrorSnackbar from "../../../components/pages/Error";
import {  fetchPasswordResetRequest } from "../../../services/user";

// Styles object
const resetPasswordStyles = {
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 350,
    padding: 4,
    borderRadius: 2,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  title: {
    fontWeight: "500",
    color: "#333",
    mb: 1,
  },
  subtitle: {
    color: "#666",
    mb: 3,
    fontSize: "0.9rem",
  },
  textField: {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(0,0,0,0.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0,0,0,0.3)",
      },
    },
  },
  submitButton: {
    mt: 2,
    bgcolor: "#333",
    color: "white",
    fontWeight: "500",
    py: 1.5,
    "&:hover": {
      bgcolor: "#222",
    },
  },
  backButton: {
    mt: 2,
    color: "#666",
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.05)",
    },
  },
  buttonProgress: {
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  successAlert: {
    mb: 3,
  }
}

interface ResetPasswordProps {
  open: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ResetPassword = ({ open, onClose, onBackToLogin }: ResetPasswordProps) => {
  
  // Form state
  const [email, setEmail] = useState("")
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Validation state
  const [emailError, setEmailError] = useState("")

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid")
      return false
    }
    
    setEmailError("")
    return true
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) return
    
    setIsLoading(true)
    setSuccess(false)
    
    try {
      // API call to request password reset
      // await api.post("PasswordReset/request", email, {
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // })
      await fetchPasswordResetRequest(email)
      // Show success message
      setSuccess(true)
      
      // Clear form
      setEmail("")
      
      // Automatically close after 5 seconds on success
      setTimeout(() => {
        onClose()
        onBackToLogin()
      }, 5000)
      
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        setError({ response: { status: 404, data: "Email not found in our system" } })
      } else if (error.response?.status === 429) {
        setError({ response: { status: 429, data: "Too many requests. Please try again later." } })
      } else {
        setError(error)
      }
      setOpenSnackbar(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => !isLoading && onClose()}
        sx={resetPasswordStyles.modal}
        aria-labelledby="reset-password-title"
      >
        <Paper elevation={6} sx={resetPasswordStyles.paper}>
          <Typography
            id="reset-password-title"
            variant="h5"
            align="center"
            gutterBottom
            sx={resetPasswordStyles.title}
          >
            Reset Password
          </Typography>
          
          <Typography
            variant="body2"
            align="center"
            sx={resetPasswordStyles.subtitle}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
          
          {success && (
            <Alert severity="success" sx={resetPasswordStyles.successAlert}>
              Password reset instructions sent! Please check your email.
            </Alert>
          )}
          
          <form onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              id="reset-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              error={!!emailError}
              helperText={emailError}
              aria-describedby="email-error"
              autoComplete="email"
              disabled={isLoading || success}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={resetPasswordStyles.textField}
            />
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading || success}
              sx={resetPasswordStyles.submitButton}
            >
              {isLoading ? (
                <>
                  Sending...
                  <CircularProgress size={24} sx={resetPasswordStyles.buttonProgress} />
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            
            <Button
              fullWidth
              variant="text"
              startIcon={<ArrowBack />}
              onClick={onBackToLogin}
              disabled={isLoading}
              sx={resetPasswordStyles.backButton}
            >
              Back to Login
            </Button>
          </form>
        </Paper>
      </Modal>
      
      <ErrorSnackbar 
        error={error} 
        open={openSnackbar} 
        onClose={() => setOpenSnackbar(false)} 
      />
    </>
  )
}