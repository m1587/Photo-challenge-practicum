import type React from "react"
import { Box, Typography, Breadcrumbs as MuiBreadcrumbs, Link } from "@mui/material"
import { motion } from "framer-motion"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import HomeIcon from "@mui/icons-material/Home"
import { Link as RouterLink, useLocation } from "react-router-dom"

interface BreadcrumbItem {
  label: string
  path?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation()

  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split("/").filter((x) => x)

    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/", icon: <HomeIcon sx={{ fontSize: 16 }} /> }]

    pathnames.forEach((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`
      const label = pathname.charAt(0).toUpperCase() + pathname.slice(1).replace("-", " ")
      breadcrumbs.push({ label, path })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  if (breadcrumbItems.length <= 1) return null

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.6) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(196, 163, 109, 0.1)",
        }}
      >
        <MuiBreadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: "#C4A36D" }} />}
          sx={{
            "& .MuiBreadcrumbs-separator": {
              mx: 1,
            },
          }}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1

            if (isLast) {
              return (
                <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {item.icon}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#C4A36D",
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              )
            }

            return (
              <Link
                key={item.label}
                component={RouterLink}
                to={item.path || "/"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#64748b",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "#C4A36D",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </MuiBreadcrumbs>
      </Box>
    </motion.div>
  )
}
