import { Drawer, Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { navLinks } from "./header.config";

import { LinkBehavior } from "@/utils/LinkBehavior";


interface MobileDrawerProps {
    open: boolean;
    onClose: () => void;
}


const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose} aria-label="mobile navigation drawer">
            <Box sx={{ width: (theme) => theme.spacing(30) }}>
                <List sx={{ pt: 2 }}>
                    {navLinks.map((link) => (
                        <ListItem key={link.path} disablePadding>
                            <ListItemButton component={LinkBehavior} to={link.path} onClick={onClose}>
                                <ListItemText primary={link.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default MobileDrawer;