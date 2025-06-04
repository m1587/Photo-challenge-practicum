// // ImageComments.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   serverTimestamp,
//   query,
//   orderBy
// } from 'firebase/firestore';
// import { db } from '../../../components/pages/firebase';

// interface Props {
//   challengeId: string;
//   imageId: string;
// }

// interface Comment {
//   id?: string;
//   text: string;
//   createdAt?: any;
// }

// export default function ImageComments({ challengeId, imageId }: Props) {
//   const [text, setText] = useState('');
//   const [comments, setComments] = useState<Comment[]>([]);

//   const commentsRef = collection(
//     db,
//     'challenges',
//     challengeId,
//     'images',
//     imageId,
//     'comments'
//   );

//   useEffect(() => {
//     const q = query(commentsRef, orderBy('createdAt', 'desc'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const list = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Comment[];
//       setComments(list);
//     });
//     return () => unsubscribe();
//   }, [challengeId, imageId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!text.trim()) return;
//     await addDoc(commentsRef, {
//       text,
//       createdAt: serverTimestamp()
//     });
//     setText('');
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           placeholder="הוסיפי תגובה לתמונה..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button type="submit">שלחי</button>
//       </form>
//       <ul>
//         {comments.map((c) => (
//           <li key={c.id}>{c.text}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore"
import { Box, TextField, Typography, Paper, Avatar, Divider, IconButton, Slide, CircularProgress } from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import { UserContext } from "../../../context/UserContext"
import { db } from "../../../lib/firebase"

interface Props {
  challengeId: string
  imageId: string
}

interface Comment {
  id?: string
  text: string
  userName?: string
  userId?: string
  createdAt?: any
}

export default function ImageComments({ challengeId, imageId }: Props) {
  const context = useContext(UserContext)
  const [text, setText] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!context) {
    throw new Error("ImageComments must be used within a UserProvider")
  }

  const { state } = context

  const commentsRef = collection(db, "challenges", challengeId, "images", imageId, "comments")

  useEffect(() => {
    setIsLoading(true)
    const q = query(commentsRef, orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[]
      setComments(list)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [challengeId, imageId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !state.name) return

    setIsSubmitting(true)
    try {
      await addDoc(commentsRef, {
        text: text.trim(),
        userName: state.name,
        userId: state.id.toString(),
        createdAt: serverTimestamp(),
      })
      setText("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return "Just now"

    const now = new Date()
    const commentTime = timestamp.toDate()
    const diffInMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(196, 163, 109, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, rgba(196, 163, 109, 0.05) 0%, rgba(196, 163, 109, 0.02) 100%)",
          borderBottom: "1px solid rgba(196, 163, 109, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ChatBubbleOutlineIcon sx={{ color: "#C4A36D", fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          sx={{
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          Comments ({comments.length})
        </Typography>
      </Box>

      {/* Comments List */}
      <Box sx={{ maxHeight: 300, overflowY: "auto", p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={24} sx={{ color: "#C4A36D" }} />
          </Box>
        ) : comments.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              No comments yet. Be the first to comment!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {comments.map((comment, index) => (
              <Slide key={comment.id} direction="up" in timeout={300 + index * 100}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.7)",
                    border: "1px solid rgba(196, 163, 109, 0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(196, 163, 109, 0.1)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#C4A36D",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {comment.userName?.charAt(0).toUpperCase() || "?"}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        {comment.userName || "Anonymous"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontSize: "12px",
                        }}
                      >
                        {formatTimeAgo(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      }}
                    >
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
              </Slide>
            ))}
          </Box>
        )}
      </Box>

      {/* Comment Input */}
      {state.name && (
        <>
          <Divider sx={{ borderColor: "rgba(196, 163, 109, 0.1)" }} />
          <Box sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#C4A36D",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {state.name.charAt(0).toUpperCase()}
                </Avatar>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Add a comment..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isSubmitting}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.8)",
                      "& fieldset": {
                        borderColor: "rgba(196, 163, 109, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(196, 163, 109, 0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#C4A36D",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      py: 1,
                    },
                  }}
                />
                <IconButton
                  type="submit"
                  disabled={!text.trim() || isSubmitting}
                  sx={{
                    bgcolor: "#C4A36D",
                    color: "white",
                    width: 40,
                    height: 40,
                    "&:hover": {
                      bgcolor: "#b3926a",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "rgba(0,0,0,0.12)",
                      color: "rgba(0,0,0,0.26)",
                    },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={16} sx={{ color: "white" }} />
                  ) : (
                    <SendIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Box>
            </form>
          </Box>
        </>
      )}
    </Paper>
  )
}
