import type { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import PageContainer from "./PageContainer";

const footerStyles: Record<string, SxProps<Theme>> = {
  root: (theme: Theme) => ({
    width: "100%",
    backgroundColor: theme.palette.grey[800],
    py: 3,
    mt: "auto",
  }),
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0.5,
  },
  text: (theme: Theme) => ({
    color: theme.palette.common.white,
    opacity: 0.6,
  }),
};

const Footer = (): ReactElement => {
  return (
    <Box component="footer" sx={footerStyles.root}>
      <PageContainer>
        <Box sx={footerStyles.content}>
          <Typography variant="caption" sx={footerStyles.text}>
            © {new Date().getFullYear()} PokéAPI · Data from pokeapi.co
          </Typography>
          <Typography variant="caption" sx={footerStyles.text}>
            Built by Nattarintra
          </Typography>
        </Box>
      </PageContainer>
    </Box>
  );
};

export default Footer;
