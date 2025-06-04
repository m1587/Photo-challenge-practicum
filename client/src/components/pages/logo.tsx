
import { Box, type BoxProps } from "@mui/material"
import LogoGraphic from "./LogoGraphic";
interface LogoProps extends BoxProps {
  width?: number
  height?: number
  showText?: boolean
}

export default function Logo({ width = 200, height = 200, showText = true, ...props }: LogoProps) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...props.sx,
      }}
      {...props}
    >
       <LogoGraphic style={{ width: "50%", height: "auto" }} />
    </Box>
  );
}
