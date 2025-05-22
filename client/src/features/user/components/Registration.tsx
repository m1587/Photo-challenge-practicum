import type React from "react"
import { useContext, useState } from "react"
import { Button, IconButton, InputAdornment, Modal, Paper, TextField, Typography, CircularProgress, FormControlLabel,
  Checkbox, Link, LinearProgress, Box
} from "@mui/material"
import { AlternateEmail, LockOpen, Person, Visibility, VisibilityOff, CheckCircle
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../../context/UserContext"
import SuccessSnackbar from "../../../components/pages/Success"
import ErrorSnackbar from "../../../components/pages/Error"
import TermsAndConditions from "../../../components/pages/TermsAndConditions"
import { fetchUserRegister } from "../../../services/user"

// Styles object for better organization
const registerStyles = {
  signUpButton: {
    bgcolor: "#333",
    color: "white",
    fontWeight: "500",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    "&:hover": {
      bgcolor: "#222",
      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 400,
    padding: 4,
    borderRadius: 2,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
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
    position: "relative",
  },
  buttonProgress: {
    color: "white",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  passwordStrength: {
    mt: 1,
    mb: 2,
  },
  passwordRequirement: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.75rem",
    color: "text.secondary",
    mt: 0.5,
  },
  termsText: {
    mt: 2,
    mb: 2,
    fontSize: "0.875rem",
  },
  signInLink: {
    textDecoration: "none",
    cursor: "pointer",
    color: "#1976d2",
    "&:hover": {
      textDecoration: "underline",
    },
  }
}

// הוספת prop חדש
interface RegisterProps {
  onSwitchToLogin?: () => void;
}
interface ApiError {
  message?: string;
  email?: string; // Added email property
  name?: string; // Added name property
  password?: string; // Added password property
  terms?: string; // Added terms property
  response?: {
    status: number;
    data?: any;
  };
}
export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const context = useContext(UserContext)
  const navigate = useNavigate()

  if (!context) {
    throw new Error("Your Component must be used within a UserProvider")
  }

  const { dispatch } = context
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState<ApiError | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [errors, setErrors] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [termsDialogOpen, setTermsDialogOpen] = useState(false)
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);

  // Password requirements
  const passwordRequirements = [
    { label: "At least 8 characters", test: (password: string) => password.length >= 8 },
    { label: "At least one uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
    { label: "At least one number", test: (password: string) => /[0-9]/.test(password) },
    { label: "At least one special character", test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const validatePassword = (password: string) => {
    const errors: any = {}

    // Calculate password strength
    let strength = 0
    passwordRequirements.forEach(req => {
      if (req.test(password)) strength += 25
    })
    setPasswordStrength(strength)

    // Set error message based on the first failed requirement
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long."
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter."
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number."
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = "Password must contain at least one special character."
    }

    return errors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })

    // Update password strength when password changes
    if (name === "password") {
      validatePassword(value)
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name) newErrors.name = "Name is required"

    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.password) newErrors.password = passwordErrors.password

    if (!agreedToTerms) newErrors.terms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // const response = await api.post("User", {
      //   email: formData.email,
      //   password: formData.password,
      //   name: formData.name,
      // })
      const response =await fetchUserRegister(formData.email, formData.password, formData.name)
      dispatch({ type: "CREATE_USER", payload: response.data })
      setFormData({ name: "", email: "", password: "" })
      setOpenSuccessSnackbar(true);
      setOpen(false)
      navigate("/login")
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.status === 409) {
        setErrors({ ...errors, email: "This email is already registered" })
      } else {
        setError(error)
        setOpenSnackbar(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "error"
    if (passwordStrength < 100) return "warning"
    return "success"
  }

  // פונקציה חדשה לטיפול בלחיצה על "Sign In"
  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    if (onSwitchToLogin) {
      onSwitchToLogin()
    }
  }

  // Open terms and conditions dialog
  const handleOpenTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setTermsDialogOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={registerStyles.signUpButton}
      >
        Sign Up
      </Button>

      <Modal
        open={open}
        onClose={() => !isLoading && setOpen(false)}
        sx={registerStyles.modal}
        aria-labelledby="register-modal-title"
      >
        <Paper elevation={6} sx={registerStyles.paper}>
          <Typography
            id="register-modal-title"
            variant="h4"
            align="center"
            gutterBottom
            sx={registerStyles.title}
          >
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="register-name"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              error={!!errors?.name}
              helperText={errors?.name || ""}
              aria-describedby="name-error"
              autoComplete="name"
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={registerStyles.textField}
            />

            <TextField
              fullWidth
              id="register-email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              margin="normal"
              error={!!errors?.email}
              helperText={errors?.email}
              aria-describedby="email-error"
              autoComplete="email"
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: "rgba(0,0,0,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={registerStyles.textField}
            />

            <TextField
              fullWidth
              id="register-password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              margin="normal"
              error={!!errors?.password}
              helperText={errors?.password}
              aria-describedby="password-error"
              autoComplete="new-password"
              disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={registerStyles.textField}
            />

            {/* Password strength indicator */}
            {formData.password && (
              <Box sx={registerStyles.passwordStrength}>
                <Typography variant="body2" gutterBottom>
                  Password strength: {passwordStrength === 100 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={getPasswordStrengthColor()}
                  sx={{ height: 8, borderRadius: 4 }}
                />

                {/* Password requirements list */}
                <Box sx={{ mt: 1 }}>
                  {passwordRequirements.map((req, index) => (
                    <Box key={index} sx={registerStyles.passwordRequirement}>
                      <CheckCircle
                        fontSize="small"
                        color={req.test(formData.password) ? "success" : "disabled"}
                        sx={{ mr: 0.5 }}
                      />
                      <Typography variant="caption">
                        {req.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Terms and conditions */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  color="primary"
                  id="terms-checkbox"
                  disabled={isLoading}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleOpenTerms}
                    sx={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              }
            />
            {errors?.terms && (
              <Typography color="error" variant="caption">
                {errors.terms}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={registerStyles.submitButton}
            >
              {isLoading ? (
                <>
                  Creating Account...
                  <CircularProgress size={24} sx={registerStyles.buttonProgress} />
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={handleSignInClick}
                sx={registerStyles.signInLink}
              >
                Sign In
              </Link>
            </Typography>
          </form>
        </Paper>
      </Modal>

      {/* Terms and Conditions Dialog */}
      <TermsAndConditions
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
      />
      <SuccessSnackbar
        open={openSuccessSnackbar}
        onClose={() => setOpenSuccessSnackbar(false)}
        message="You have successfully registered!"
      />

      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </>
  )
}

export default Register;