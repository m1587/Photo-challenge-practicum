
import { useContext, useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react"
import { Button, Modal, TextField, Typography, Paper, IconButton, InputAdornment, FormControlLabel, Checkbox, Link, CircularProgress,
Snackbar, Alert} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  LockOpen,
  AlternateEmail
} from "@mui/icons-material"
import { useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
import ErrorSnackbar from "../ui/Error"
import api from "../../lib/axiosConfig"
import { ResetPassword } from "./ResetPassword"

// הגדרת הטיפוס של הרפרנס
export interface LoginRef {
  openLoginModal: () => void;
}

// Styles object to keep the component cleaner
const loginStyles = {
  signInButton: {
    background: "rgba(255,255,255,0.9)",
    color: "#333",
    fontWeight: "500",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    "&:hover": {
      background: "rgba(255,255,255,1)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
    },
  },
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
    mb: 3,
  },
  textField: {
    mb: 2,
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
  forgotPassword: {
    mt: 2,
    textAlign: "center",
  },
  buttonProgress: {
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = forwardRef<LoginRef, LoginProps>(({ onLoginSuccess }, ref) => {
  const context = useContext(UserContext)
  const navigate = useNavigate()

  if (!context) {
    throw new Error("Your Component must be used within a UserProvider")
  }

  const {dispatch} = context
  const [open, setOpen] = useState(false)
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);

  const location = useLocation()

  // חשיפת פונקציה לפתיחת המודל דרך הרפרנס
  useImperativeHandle(ref, () => ({
    openLoginModal: () => setOpen(true)
  }));

  // Form state
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem("userEmail"))

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  // Validation state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const openedFromRoute = useRef(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  useEffect(() => {
    if (location.pathname === "/login") {
      setOpen(true)
      openedFromRoute.current = true
    }
  }, [location.pathname])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!userEmail) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const res = await api.post<{ token: string; user: any }>("User/login", {
        email: userEmail,
        password: password,
      })

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("userEmail", userEmail)
      } else {
        localStorage.removeItem("userEmail")
      }

      localStorage.setItem("token", res.data.token)
      dispatch({
        type: "CREATE_USER",
        payload: res.data.user,
      })

      setOpen(false)
      onLoginSuccess()
      setPassword("")
      setSuccessSnackbarOpen(true);
      openedFromRoute.current = false 
      navigate("/")
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.status === 401) {
        setError({ response: { status: 401, data: "Invalid email or password" } })
      } else if (error.response?.status === 429) {
        setError({ response: { status: 429, data: "Too many login attempts. Please try again later." } })
      } else {
        setError(error)
      }
      setOpenSnackbar(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setShowResetPassword(true)
    setOpen(false) // סגור את מודל ההתחברות
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={loginStyles.signInButton}
      >
        Sign In
      </Button>

      <Modal
        open={open}
        onClose={() => !isLoading && setOpen(false)}
        sx={loginStyles.modal}
        aria-labelledby="login-modal-title"
      >
        <Paper elevation={6} sx={loginStyles.paper}>
          <Typography
            id="login-modal-title"
            variant="h4"
            align="center"
            gutterBottom
            sx={loginStyles.title}
          >
            Welcome Back
          </Typography>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}>
            <TextField
              fullWidth
              id="login-email"
              label="Email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              aria-describedby="email-error"
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={loginStyles.textField}
            />

            <TextField
              fullWidth
              id="login-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              aria-describedby="password-error"
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpen sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={loginStyles.textField}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  id="remember-me"
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={loginStyles.submitButton}
            >
              {isLoading ? (
                <>
                  Signing in...
                  <CircularProgress size={24} sx={loginStyles.buttonProgress} />
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Typography variant="body2" sx={loginStyles.forgotPassword}>
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ textDecoration: "none" }}
                type="button" // Prevent form submission
              >
                Forgot password?
              </Link>
            </Typography>
          </form>
        </Paper>
      </Modal>
      <ResetPassword
        open={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onBackToLogin={() => {
          setShowResetPassword(false)
          setOpen(true) // פתח מחדש את מודל ההתחברות
        }}
      />
      <Snackbar
  open={successSnackbarOpen}
  autoHideDuration={4000}
  onClose={() => setSuccessSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity="success" onClose={() => setSuccessSnackbarOpen(false)} sx={{ width: '100%' }}>
    Login successful!
  </Alert>
</Snackbar>

      <ErrorSnackbar
        error={error}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </>
  )
});