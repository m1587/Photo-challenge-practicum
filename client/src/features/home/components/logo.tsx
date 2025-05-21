
import { Box, type BoxProps } from "@mui/material"
import  LogoSvg  from '../../../assets/logos/logo.svg';
interface LogoProps extends BoxProps {
  width?: number
  height?: number
  showText?: boolean
}

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
    <img src={LogoSvg} width={width} height={height} alt="Logo" />
    </Box>
  );
}
