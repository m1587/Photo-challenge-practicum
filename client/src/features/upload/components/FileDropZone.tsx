"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Box, Typography, Button, Chip, Fade } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

interface FileDropZoneProps {
  file: File | null
  onFileSelect: (file: File) => void
  validateFile?: (file: File) => boolean
  formatFileSize?: (bytes: number) => string
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  file,
  onFileSelect,
  validateFile = () => true,
  formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  },
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      onFileSelect(selectedFile)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev - 1)
    if (dragCounter === 1) {
      setIsDragOver(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const droppedFile = files[0]
      handleFileSelect(droppedFile)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  return (
    <Box
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed",
        borderColor: isDragOver ? "#C4A36D" : file ? "#C4A36D" : "rgba(196, 163, 109, 0.3)",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
        background: isDragOver
          ? "linear-gradient(135deg, rgba(196, 163, 109, 0.15) 0%, rgba(196, 163, 109, 0.08) 100%)"
          : file
            ? "linear-gradient(135deg, rgba(196, 163, 109, 0.05) 0%, rgba(196, 163, 109, 0.02) 100%)"
            : "rgba(248, 250, 252, 0.5)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transform: isDragOver ? "scale(1.02)" : "scale(1)",
        "&:hover": {
          borderColor: "#C4A36D",
          background: "linear-gradient(135deg, rgba(196, 163, 109, 0.08) 0%, rgba(196, 163, 109, 0.04) 100%)",
          transform: "scale(1.01)",
        },
      }}
      onClick={handleButtonClick}
    >
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" onChange={handleInputChange} style={{ display: "none" }} accept="image/*" />

      {/* Drag overlay effect */}
      {isDragOver && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(196, 163, 109, 0.1) 0%, rgba(196, 163, 109, 0.05) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            animation: "pulse 1.5s ease-in-out infinite",
            "@keyframes pulse": {
              "0%": { opacity: 0.5 },
              "50%": { opacity: 0.8 },
              "100%": { opacity: 0.5 },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(196, 163, 109, 0.4)",
                animation: "bounce 1s ease-in-out infinite",
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            >
              <DragIndicatorIcon sx={{ color: "white", fontSize: 32 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#C4A36D",
                fontWeight: 700,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Drop your photo here!
            </Typography>
          </Box>
        </Box>
      )}

      {/* Upload content */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {!file ? (
          <Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: isDragOver
                  ? "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)"
                  : "linear-gradient(135deg, rgba(196, 163, 109, 0.1) 0%, rgba(196, 163, 109, 0.05) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                transition: "all 0.3s ease",
                boxShadow: isDragOver ? "0 8px 24px rgba(196, 163, 109, 0.4)" : "0 4px 12px rgba(196, 163, 109, 0.2)",
              }}
            >
              <CloudUploadIcon
                sx={{
                  color: isDragOver ? "white" : "#C4A36D",
                  fontSize: 32,
                  transition: "all 0.3s ease",
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: 600,
                mb: 1,
              }}
            >
              {isDragOver ? "Drop your photo here" : "Drag & drop your photo"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 3,
              }}
            >
              or click to browse files
            </Typography>

            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                borderColor: "#C4A36D",
                color: "#1e293b",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#b3926a",
                  bgcolor: "rgba(196, 163, 109, 0.05)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(196, 163, 109, 0.2)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Choose Photo
            </Button>

            <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid rgba(196, 163, 109, 0.1)" }}>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 1 }}>
                Supported formats: JPG, PNG, GIF, WebP
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Maximum file size: 10MB
              </Typography>
            </Box>
          </Box>
        ) : (
          <Fade in timeout={500}>
            <Box>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                }}
              >
                <CheckCircleIcon sx={{ color: "white", fontSize: 32 }} />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: "#10b981",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Photo Selected Successfully!
              </Typography>

              <Chip
                label={`${file.name} (${formatFileSize(file.size)})`}
                variant="outlined"
                sx={{
                  borderColor: "#10b981",
                  color: "#1e293b",
                  fontWeight: 500,
                  maxWidth: "100%",
                  "& .MuiChip-label": {
                    px: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />

              <Button
                variant="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFileSelect(new File([], ""))
                }}
                sx={{
                  mt: 2,
                  color: "#64748b",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "rgba(100, 116, 139, 0.1)",
                  },
                }}
              >
                Choose different photo
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  )
}

export default FileDropZone
