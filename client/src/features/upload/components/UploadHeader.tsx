import { Box, Typography } from "@mui/material"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"

export const UploadHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 3,
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1.5,
          borderRadius: "50%",
          bgcolor: "rgba(196, 163, 109, 0.2)",
        }}
      >
        <PhotoCameraIcon sx={{ fontSize: 24, color: "#C4A36D" }} />
      </Box>
      <Typography
        variant="h5"
        sx={{
          color: "#C4A36D",
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        Upload Your Photos
      </Typography>
    </Box>
  )
}

