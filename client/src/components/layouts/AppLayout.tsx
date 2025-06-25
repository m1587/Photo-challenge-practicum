import { useState, useRef, useEffect } from "react"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import { Box } from "@mui/material"
import type { LoginRef } from "../../features/user/components/Login"
import Footer from "./Footer"
import "../../styles/theme.css"
import TermsAndConditions from "../pages/TermsAndConditions"

const AppLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  const loginRef = useRef<LoginRef>(null)

  useEffect(() => {
    const token = sessionStorage.getItem("user")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleSwitchToLogin = () => {
    if (loginRef.current) {
      loginRef.current.openLoginModal()
    }
  }

  const handleOpenTerms = () => {
    setIsTermsOpen(true)
  }
  const handleCloseTerms = () => {
    setIsTermsOpen(false)
  }

  return (
    <>
      <Box
        className="app-layout"
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(2px)",
            zIndex: 0,
          },
        }}
      >
        <Navbar
          isLoggedIn={isLoggedIn}
          loginRef={loginRef}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />

        <Box
          sx={{
            mt: 8,
            p: 3,
            position: "relative",
            zIndex: 1,
            pt: 10,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Footer onOpenTerms={handleOpenTerms} />
      <TermsAndConditions open={isTermsOpen} onClose={handleCloseTerms} />

    </>
  )
}

export default AppLayout
