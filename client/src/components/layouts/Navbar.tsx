
// import { Link } from "react-router-dom"
// import { AppBar, Toolbar, Button, Box } from "@mui/material"
// import HomeIcon from "@mui/icons-material/Home"
// import HistoryIcon from "@mui/icons-material/History"
// import EmailIcon from "@mui/icons-material/Email" 

// const Navbar = () => {
//   return (
//     <AppBar
//       position="fixed"
//       color="transparent"
//       sx={{
//         bgcolor: "rgba(255,255,255,0.8)",
//         backdropFilter: "blur(10px)",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//         height: "64px",
//         borderBottom: "1px solid rgba(255,255,255,0.2)",
//       }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", height: "100%" }}>
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Button
//             color="inherit"
//             component={Link}
//             to="/previous-challenges"
//             sx={{
//               color: "#333",
//               fontWeight: "500",
//               borderRadius: 2,
//               "&:hover": {
//                 bgcolor: "rgba(0,0,0,0.04)",
//               },
//             }}
//           >
//             <HistoryIcon sx={{ fontSize: 24 }} />
//           </Button>
//           <Button
//             color="inherit"
//             component={Link}
//             to="/Contact"
//             sx={{
//               color: "#333",
//               fontWeight: "500",
//               borderRadius: 2,
//               "&:hover": {
//                 bgcolor: "rgba(0,0,0,0.04)",
//               },
//             }}
//           >
//             <EmailIcon sx={{ fontSize: 24 }} />
//           </Button>
//           <Button
//             color="inherit"
//             component={Link}
//             to="/"
//             sx={{
//               color: "#333",
//               fontWeight: "500",
//               borderRadius: 2,
//               "&:hover": {
//                 bgcolor: "rgba(0,0,0,0.04)",
//               },
//             }}
//           >
//             <HomeIcon sx={{ fontSize: 24 }} />
//           </Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default Navbar

import { Box} from "@mui/material"
import { Link } from "react-router-dom"
import { AppBar, Toolbar, Button } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import HistoryIcon from "@mui/icons-material/History"
import EmailIcon from "@mui/icons-material/Email"
const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{
        bgcolor: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        height: "64px",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
        {/* לוגו בצד שמאל
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Logo width={40} height={40} showText={false} /> {/* שינוי גודל לפי הצורך */}
        {/* </Box> */} 

        {/* ניווט בצד ימין */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/previous-challenges"
            sx={{
              color: "#333",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <HistoryIcon sx={{ fontSize: 24 }} />
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/Contact"
            sx={{
              color: "#333",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <EmailIcon sx={{ fontSize: 24 }} />
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              color: "#333",
              fontWeight: "500",
              borderRadius: 2,
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <HomeIcon sx={{ fontSize: 24 }} />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
