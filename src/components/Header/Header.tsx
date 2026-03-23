import { useState, type ReactElement } from "react";

import Logo from "../Logo/Logo";
import logo from "@/assets/images/logo.png";
import MobileDrawer from "./MobileDrawer";
import { Box, AppBar, Toolbar, IconButton, Link, type SxProps, type Theme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { LinkBehavior } from "@/utils/LinkBehavior";
import { navLinks } from "./header.config";



type HeaderStyleKeys = "navContainer" | "navLink" | "mobileButton";

const headerStyles: Record<HeaderStyleKeys, SxProps<Theme>> = {
    navContainer: {
        ml: "auto",
        display: { xs: "none", md: "flex" },
        gap: 3,
    },

    navLink: {
        textDecoration: "none",
        color: "text.primary",
        fontWeight: 500,
        transition: (theme) =>
            theme.transitions.create(["color", "transform"], {
                duration: theme.transitions.duration.short,
            }),

        "&:hover": {
            color: "text.secondary",
            transform: "scale(1.05)",
        },
    },

    mobileButton: {
        ml: "auto",
        display: { xs: "flex", md: "none" },
    },
};


const Header = (): ReactElement => {

    const [open, setOpen] = useState(false);

    const toggleDrawer = (state: boolean) => {
        setOpen(state);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar>
                <Toolbar>
                    <Logo src={logo} alt="Pokemon logo" />
                    {/* Desktop */}
                    <Box sx={headerStyles.navContainer} >
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                component={LinkBehavior}
                                to={link.path}
                                sx={headerStyles.navLink}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Box>
                    {/* Mobile */}
                    <IconButton
                        aria-label="open navigation menu"
                        onClick={() => toggleDrawer(true)}
                        sx={headerStyles.mobileButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <MobileDrawer open={open} onClose={() => setOpen(false)} />
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;