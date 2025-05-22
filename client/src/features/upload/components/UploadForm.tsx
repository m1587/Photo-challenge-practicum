import { Button, LinearProgress, TextField, Box, Card, CardContent, CardActions, Typography } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import type React from "react"

interface UploadFormProps {
  file: File | null
  progress: number
  currentCaption: string
  isCaptionUpdated: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setCurrentCaption: (caption: string) => void
  handleUpload: () => Promise<void>
}

export const UploadForm: React.FC<UploadFormProps> = ({
  file,
  progress,
  currentCaption,
  isCaptionUpdated,
  handleFileChange,
  setCurrentCaption,
  handleUpload,
}) => {

  return (
    <Card
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.2)",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, color: "#333", fontWeight: 500 }}>
          Upload a Photo
        </Typography>
        <input type="file" onChange={handleFileChange} style={{ display: "none" }} id="upload-button" />
        <label htmlFor="upload-button">
          <Button
            variant="outlined"
            component="span"
            fullWidth
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: "#C4A36D",
              color: "#333",
              py: 1,
              borderRadius: 1.5,
              fontWeight: 500,
              "&:hover": {
                borderColor: "#b3926a",
                bgcolor: "rgba(196, 163, 109, 0.05)",
              },
            }}
          >
            Select Image
          </Button>
        </label>
        {file && !isCaptionUpdated && (
          <TextField
            label="Add caption"
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                "& fieldset": {
                  borderColor: "rgba(0,0,0,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "#C4A36D",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#C4A36D",
                },
              },
            }}
            value={currentCaption}
            onChange={(e) => setCurrentCaption(e.target.value)}
          />
        )}
        {progress > 0 && <ProgressIndicator progress={progress} />}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleUpload}
          disabled={!file || !currentCaption}
          size="small"
          sx={{
            bgcolor: "#C4A36D",
            color: "white",
            py: 1,
            borderRadius: 1.5,
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#b3926a",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(0,0,0,0.12)",
              color: "rgba(0,0,0,0.26)",
            },
          }}
        >
          Upload Photo
        </Button>
      </CardActions>
    </Card>

  )
}

interface ProgressIndicatorProps {
  progress: number
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.75rem" }}>
          Uploading...
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)", fontWeight: 500, fontSize: "0.75rem" }}>
          {progress}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: "rgba(196, 163, 109, 0.1)",
          "& .MuiLinearProgress-bar": {
            bgcolor: "#C4A36D",
          },
        }}
      />
    </Box>
  )
}

