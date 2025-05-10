

import { Box } from "@mui/material"

export const HomeBackground = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // תמונת רקע חדשה
        background: `url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074') no-repeat center center`,
        backgroundSize: "cover",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
        },
        zIndex: -1,
      }}
    />
  )
}
