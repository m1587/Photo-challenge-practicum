import { Box, Typography, Chip } from "@mui/material"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"

export const UploadHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 4,
        pb: 3,
        borderBottom: "1px solid rgba(196, 163, 109, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 3,
            background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
            boxShadow: "0 8px 16px rgba(196, 163, 109, 0.3), 0 4px 8px rgba(196, 163, 109, 0.2)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: 3,
              padding: "2px",
              background: "linear-gradient(135deg, #C4A36D, #d4a574, #C4A36D)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
            },
          }}
        >
          <PhotoCameraIcon sx={{ fontSize: 32, color: "white" }} />
        </Box>

        <Box>
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              mb: 0.5,
            }}
          >
            Upload Your Photo
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              letterSpacing: "0.25px",
            }}
          >
            Share your creativity with the community
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
        <Chip
          icon={<TrendingUpIcon />}
          label="Weekly Challenge"
          variant="outlined"
          sx={{
            borderColor: "#C4A36D",
            color: "#1e293b",
            fontWeight: 600,
            background: "rgba(196, 163, 109, 0.05)",
            "& .MuiChip-icon": {
              color: "#C4A36D",
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          One submission per challenge
        </Typography>
      </Box>
    </Box>
  )
}
