import { Drawer, Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { navLinks } from "./header.config";

import { LinkBehavior } from "@/components/Links/LinkBehavior";
import { DRAWER_WIDTH } from "@/constants";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} aria-label="mobile navigation drawer">
      <Box sx={{ width: DRAWER_WIDTH }}>
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
