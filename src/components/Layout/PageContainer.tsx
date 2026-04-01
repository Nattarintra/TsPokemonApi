import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";
import { GRID_MAX_WIDTH } from "@/constants";

interface PageContainerProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const pageContainerStyles: Record<"root", SxProps<Theme>> = {
  root: {
    width: "100%",
    maxWidth: GRID_MAX_WIDTH,
    mx: "auto",
    px: { xs: 2, sm: 3 },
    mt: { xs: 2, sm: 3 },
  },
};

const PageContainer = ({ children, sx }: PageContainerProps) => {
  return <Box sx={[pageContainerStyles.root, ...(Array.isArray(sx) ? sx : [sx])]}>{children}</Box>;
};

export default PageContainer;
