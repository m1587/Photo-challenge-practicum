"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { TextField, Button, Typography, Paper, Alert, CircularProgress, InputAdornment, Box } from "@mui/material"
import { LockOutlined, LockOpenOutlined, ArrowBack } from "@mui/icons-material"
import ErrorSnackbar from "../../../components/pages/Error"
import { fetchPasswordReset } from "../../../services/user"

// Styles object
const resetPasswordStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: 2,
    background: "linear-gradient(to right bottom, #f5f5f5, #e0e0e0)",
  },
  paper: {
    width: 400,
    padding: 4,
    borderRadius: 2,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
  title: {
    fontWeight: "500",
    color: "#333",
    mb: 1,
    textAlign: "center",
  },
  subtitle: {
    color: "#666",
    mb: 3,
    fontSize: "0.9rem",
    textAlign: "center",
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
    position: "relative",
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
  },
  errorAlert: {
    mb: 3,
  },
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email") || ""

  // Form state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // UI state
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [apiError, setApiError] = useState<any>(null)

  // Validation state
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.")
    }
  }, [token])

  const validateForm = () => {
    let isValid = true

    // Validate password
    if (!password) {
      setPasswordError("Password is required")
      isValid = false
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      isValid = false
    } else {
      setPasswordError("")
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password")
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    } else {
      setConfirmPasswordError("")
    }

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // await api.post("/PasswordReset/reset", {
      //   token,
      //   email,
      //   newPassword: password,
      // })
      await fetchPasswordReset(token, email, password)
      setSuccess(true)

      // Automatically redirect to login page after 5 seconds
      setTimeout(() => {
        navigate("/login")
      }, 5000)
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data || "Something went wrong"
      setError(message)
      setApiError(err)
      setOpenSnackbar(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  return (
    <Box sx={resetPasswordStyles.container}>
      <Paper elevation={6} sx={resetPasswordStyles.paper}>
        <Typography variant="h5" gutterBottom sx={resetPasswordStyles.title}>
          Set New Password
        </Typography>

        <Typography variant="body2" sx={resetPasswordStyles.subtitle}>
          Please enter your new password below.
        </Typography>

        {error && !openSnackbar && (
          <Alert severity="error" sx={resetPasswordStyles.errorAlert}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={resetPasswordStyles.successAlert}>
            Password reset successfully! You will be redirected to the login page.
          </Alert>
        )}

        {!success && token && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={resetPasswordStyles.textField}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenOutlined sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={resetPasswordStyles.textField}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={resetPasswordStyles.submitButton}
            >
              {isLoading ? (
                <>
                  Resetting...
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
              onClick={handleBackToLogin}
              disabled={isLoading}
              sx={resetPasswordStyles.backButton}
            >
              Back to Login
            </Button>
          </form>
        )}
      </Paper>

      <ErrorSnackbar error={apiError} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </Box>
  )
}

export default ResetPasswordPage
