import { Box, AppBar, Toolbar, Button } from "@mui/material"
import { Link } from "react-router-dom"
import HomeIcon from "@mui/icons-material/Home"
import HistoryIcon from "@mui/icons-material/History"
import EmailIcon from "@mui/icons-material/Email"
import Logo from "../pages/logo"
import { UserName } from "../../features/user/components/UserName"
import { Login } from "../../features/user/components/Login"
import Register from "../../features/user/components/Registration"
import type { RefObject } from "react"
import ThemeToggle from "../pages/ThemeToggle"

interface NavbarProps {
  isLoggedIn: boolean
  loginRef: RefObject<any>
  onLoginSuccess: () => void
  onSwitchToLogin: () => void
}

const Navbar = ({ isLoggedIn, loginRef, onLoginSuccess, onSwitchToLogin }: NavbarProps) => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      className="navbar"
      sx={{
        bgcolor: "rgba(10, 14, 23, 0.95)" /* כהה יותר, כחול-שחור */,
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        height: "64px",
        borderBottom: "1px solid rgba(212, 165, 116, 0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
        {/* לוגו בצד שמאל */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Logo width={40} height={40} showText={false} />
        </Box>

        {/* ניווט במרכז */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            color="inherit"
            component={Link}
            to="/previous-challenges"
            sx={{
              color: "#cbd5e1",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(212, 165, 116, 0.1)",
                color: "#d4a574",
              },
            }}
          >
            <HistoryIcon sx={{ fontSize: 24 }} />
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/Contact"
            sx={{
              color: "#cbd5e1",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(212, 165, 116, 0.1)",
                color: "#d4a574",
              },
            }}
          >
            <EmailIcon sx={{ fontSize: 24 }} />
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              color: "#cbd5e1",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(212, 165, 116, 0.1)",
                color: "#d4a574",
              },
            }}
          >
            <HomeIcon sx={{ fontSize: 24 }} />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </Box>

        {/* משתמש/התחברות בצד ימין */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isLoggedIn ? (
            <UserName />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                borderRadius: 2,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(212, 165, 116, 0.2)",
              }}
            >
              {/* העברת הרפרנס לקומפוננטת Login */}
              <Login ref={loginRef} onLoginSuccess={onLoginSuccess} />
              {/* העברת פונקציית המעבר לקומפוננטת Register */}
              <Register onSwitchToLogin={onSwitchToLogin} />
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

