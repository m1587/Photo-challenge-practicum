"use client"

import { Box, Container, Skeleton, Paper } from "@mui/material"
import { motion } from "framer-motion"

export const LoadingSkeleton = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 10, md: 4 },
        pb: 6,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
      }}
    >
      <Container maxWidth="xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* Header Skeleton */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: "auto", mb: 2 }} />
            <Skeleton variant="text" width={300} height={60} sx={{ mx: "auto", mb: 2 }} />
            <Skeleton variant="text" width={500} height={30} sx={{ mx: "auto" }} />
          </Box>

          {/* Stats Skeleton */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.8)",
            }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ textAlign: "center" }}>
                  <Skeleton variant="circular" width={60} height={60} sx={{ mx: "auto", mb: 1 }} />
                  <Skeleton variant="text" width={40} height={40} sx={{ mx: "auto", mb: 1 }} />
                  <Skeleton variant="text" width={80} height={20} sx={{ mx: "auto" }} />
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Filters Skeleton */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.8)",
            }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr", gap: 2 }}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Box>
          </Paper>

          {/* Grid Skeleton */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.8)",
            }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3 }}>
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  )
}
