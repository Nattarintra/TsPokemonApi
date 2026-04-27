import { useState, type ReactElement } from "react";
import { useLocation, useMatch } from "react-router-dom";

import Logo from "@/components/Logo/Logo";
import logo from "@/assets/images/logo.png";
import MobileDrawer from "./MobileDrawer";
import { Box, AppBar, Toolbar, IconButton, Link, type SxProps, type Theme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { LinkBehavior } from "@/components/Links/LinkBehavior";
import { getNavLinks } from "./header.config";
import SearchBar from "@/components/Search/SearchBar";
import SearchModal from "@/components/Search/SearchModal";

type HeaderStyleKeys = "navContainer" | "mobileButton" | "navLink" | "navLinkActive";

const headerStyles: Record<HeaderStyleKeys, SxProps<Theme>> = {
  navContainer: {
    ml: "auto",
    display: { xs: "none", md: "flex" },
    gap: (theme) => theme.spacing(3),
  },

  mobileButton: {
    ml: "auto",
    display: { xs: "flex", md: "none" },
  },

  navLink: {
    borderBottom: "2px solid transparent",
    pb: 0.5,
  },

  navLinkActive: {
    borderBottom: "2px solid currentColor",
    pb: 0.5,
  },
};

const Header = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const detailsMatch = useMatch("/details/:id");
  const navLinks = getNavLinks({
    isDetailsPage: Boolean(detailsMatch),
    detailsPath: location.pathname,
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Left — Logo fixed width */}
          <Box sx={{ flexShrink: 0 }}>
            <Logo src={logo} alt="Pokemon logo" />
          </Box>

          {/* Center — SearchBar takes remaining space */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: 1 }}>
            <Box sx={{ width: { xs: "100%", md: "320px" } }}>
              <SearchBar onClick={() => setSearchOpen(true)} />
            </Box>
          </Box>

          {/* Right — Nav + Hamburger fixed width */}
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Box sx={headerStyles.navContainer}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  component={LinkBehavior}
                  to={link.path}
                  sx={location.pathname === link.path ? headerStyles.navLinkActive : headerStyles.navLink}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
            <IconButton
              aria-label="open navigation menu"
              onClick={() => setOpen(true)}
              sx={headerStyles.mobileButton}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <MobileDrawer open={open} onClose={() => setOpen(false)} navLinks={navLinks} />
          <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
