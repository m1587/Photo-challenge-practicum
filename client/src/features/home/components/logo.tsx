
import { Box, type BoxProps } from "@mui/material"

interface LogoProps extends BoxProps {
  width?: number
  height?: number
  showText?: boolean
}

// import logoSvgPath from "/assets/logo.svg";  // ייבוא כ-URL
// import { ReactComponent as LogoSvg } from '../../assets/logo.svg';

export default function Logo({ width = 120, height = 120, showText = true, ...props }: LogoProps) {
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
      {/* <Box
          component="img"
          src={logoSvgPath}
          alt="Logo"
          sx={{
            width: `${width}px`,
            height: `${height}px`,
            objectFit: "contain",
          }}
        /> */}
      {/* <LogoSvg style={{ width, height }} /> */}
    </Box>
  );
}
