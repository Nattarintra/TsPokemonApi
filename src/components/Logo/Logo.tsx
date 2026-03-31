import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

interface LogoProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

const Logo = ({ src, alt, width = 70, height = 70 }: LogoProps): ReactElement => {
  return (
    <Box component={Link} to="/" sx={{ display: "inline-block", cursor: "pointer" }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          display: "block",
          width,
          height,
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

export default Logo;
