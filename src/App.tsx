import { Outlet } from "react-router-dom";
import Header from "@components/Header/Header";
import { Box, type SxProps, type Theme } from "@mui/material";

const appStyles: Record<"main", SxProps<Theme>> = {
  main: {
    pt: { xs: 2, sm: 3 },
    pb: { xs: 4, sm: 6 },
    minHeight: "100vh",
  },
};
const App = () => {
  return (
    <>
      <Header />
      <Box component="main" sx={appStyles.main}>
        <Outlet />
      </Box>
    </>
  );
};

export default App;
