"use client"

import { useEffect, useState } from "react"
import { IconButton, Tooltip } from "@mui/material"
import { motion } from "framer-motion"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // בדיקה אם יש theme שמור ב-localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // בדיקה של העדפת המערכת
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    document.body.className = theme
    localStorage.setItem("theme", theme)

    // עדכון CSS variables
    const root = document.documentElement
    if (theme === "dark") {
      root.style.setProperty("--bg-primary", "#0f172a")
      root.style.setProperty("--bg-secondary", "#1e293b")
      root.style.setProperty("--text-primary", "#f1f5f9")
      root.style.setProperty("--text-secondary", "#cbd5e1")
      root.style.setProperty("--border-color", "rgba(212, 165, 116, 0.2)")
    } else {
      root.style.setProperty("--bg-primary", "#f8fafc")
      root.style.setProperty("--bg-secondary", "#ffffff")
      root.style.setProperty("--text-primary", "#1e293b")
      root.style.setProperty("--text-secondary", "#64748b")
      root.style.setProperty("--border-color", "rgba(196, 163, 109, 0.2)")
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }

  return (
    <Tooltip title={theme === "light" ? "מצב כהה" : "מצב בהיר"} arrow>
      <IconButton
        onClick={toggleTheme}
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          color: "#cbd5e1",
          borderRadius: 2,
          width: 40,
          height: 40,
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "rgba(212, 165, 116, 0.1)",
            color: "#d4a574",
            transform: "translateY(-1px)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 20,
            transition: "all 0.3s ease",
          },
        }}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 180 : 0,
            scale: theme === "dark" ? 1.1 : 1,
          }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
        >
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </motion.div>
      </IconButton>
    </Tooltip>
  )
}
