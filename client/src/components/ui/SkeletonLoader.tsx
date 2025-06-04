"use client"

import { Box, Skeleton, Card, CardContent } from "@mui/material"
import { motion } from "framer-motion"

interface SkeletonLoaderProps {
  variant?: "card" | "list" | "profile" | "gallery"
  count?: number
}

export const SkeletonLoader = ({ variant = "card", count = 1 }: SkeletonLoaderProps) => {
  const renderCardSkeleton = () => (
    <Card
      sx={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        border: "1px solid rgba(196, 163, 109, 0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{
            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            "@keyframes shimmer": {
              "0%": { backgroundPosition: "-200% 0" },
              "100%": { backgroundPosition: "200% 0" },
            },
          }}
        />
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
        </Box>
      </CardContent>
    </Card>
  )

  const renderListSkeleton = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} />
      </Box>
      <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
    </Box>
  )

  const renderProfileSkeleton = () => (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, p: 3 }}>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" width="60%" height={28} />
      <Skeleton variant="text" width="40%" height={20} />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
      </Box>
    </Box>
  )

  const renderGallerySkeleton = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={16} />
            </Box>
          </Box>
        </motion.div>
      ))}
    </Box>
  )

  const skeletonMap = {
    card: renderCardSkeleton,
    list: renderListSkeleton,
    profile: renderProfileSkeleton,
    gallery: renderGallerySkeleton,
  }

  if (variant === "gallery") {
    return renderGallerySkeleton()
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {skeletonMap[variant]()}
        </motion.div>
      ))}
    </Box>
  )
}
