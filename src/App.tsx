import { Outlet } from "react-router-dom";
import Header from "@components/Header/Header";
import Footer from "@/components/Layout/Footer";
import { Box, type SxProps, type Theme } from "@mui/material";

const appStyles: Record<"wrapper" | "main", SxProps<Theme>> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    pt: { xs: 2, sm: 3 },
    pb: { xs: 4, sm: 6 },
    flex: 1,
  },
};

const App = () => {
  return (
    <Box sx={appStyles.wrapper}>
      <Header />
      <Box component="main" sx={appStyles.main}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
