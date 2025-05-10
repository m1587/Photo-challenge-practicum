import type React from "react"
import { useContext, useState } from "react"
import { Avatar, Typography, Box, Menu, MenuItem, Skeleton } from "@mui/material"
import { LogOut, User } from "lucide-react"
import { UserContext } from "../../../context/UserContext"

export function UserName() {
  const context = useContext(UserContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!context) {
    throw new Error("UserName must be used within a UserProvider")
  }

  const { state, dispatch } = context

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setIsLoading(true)
    // Simulate logout process
    setTimeout(() => {
      localStorage.removeItem("token")
      if (dispatch) {
        dispatch({ type: "LOGOUT" })
      }
      handleMenuClose()
      setIsLoading(false)
      window.location.reload() // Refresh the page to reset the app state
    }, 500)
  }

  // If we're in a loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width={100} height={32} />
      </Box>
    )
  }

  // If there's no user name
  if (!state.name) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(0,0,0,0.2)",
            border: "2px solid",
            borderColor: "rgba(255,255,255,0.3)",
            width: 48,
            height: 48,
          }}
        >
          <User size={24} />
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "500",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          Guest
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          borderRadius: 2,
          p: 1.5,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "linear-gradient(to right, rgba(255,255,255,0.15), rgba(255,255,255,0.1))",
          },
          "&:focus-visible": {
            outline: "2px solid white",
            outlineOffset: "2px",
          },
        }}
        onClick={handleMenuOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleMenuOpen(e as unknown as React.MouseEvent<HTMLElement>)
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="User menu"
        aria-controls="user-menu"
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              bgcolor: "rgba(0,0,0,0.2)",
              border: "2px solid",
              borderColor: "rgba(255,255,255,0.3)",
              width: 48,
              height: 48,
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {state.name ? state.name.charAt(0).toUpperCase() : <User size={24} />}
          </Avatar>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "#4caf50", // Green for online status
              border: "2px solid rgba(255,255,255,0.8)",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "500",
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              lineHeight: 1.2,
            }}
          >
            {state.name}
          </Typography>
          {state.email && (
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.8)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {state.email}
            </Typography>
          )}
        </Box>
      </Box>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate("/profile") // השתמש ב-navigate במקום router.push
          }}
        >
          <User size={16} style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate("/settings") // השתמש ב-navigate במקום router.push
          }}
        >
          <Settings size={16} style={{ marginRight: 8 }} />
          Settings
        </MenuItem> */}
        <MenuItem onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}
