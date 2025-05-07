
import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"
import HistoryIcon from "@mui/icons-material/History"

export const ChallengeHeader = () => {
  const headerColor = "#C4A36D"
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          p: 2,
          borderRadius: "50%",
          bgcolor: "rgba(196, 163, 109, 0.2)",
        }}
      >
        <HistoryIcon sx={{ fontSize: 40, color: headerColor }} />
      </Box>

      <Typography
        variant="h2"
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        sx={{
          color: headerColor,
          fontWeight: 700,
          mb: 2,
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          fontSize: { xs: "2rem", md: "3rem" },
          textAlign: "center",
        }}
      >
        Previous challenges
      </Typography>

      <Typography
        variant="h6"
        component={motion.p}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        sx={{
          color: "white",
          mb: 4,
          maxWidth: 700,
          textAlign: "center",
          textShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        View our previous competitions and the winning photos that impressed the judges
      </Typography>
    </Box>
  )
}

