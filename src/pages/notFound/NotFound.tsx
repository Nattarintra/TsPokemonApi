import type { ReactElement } from "react";
import {
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Link as RouterLink } from "react-router-dom";

type NotFoundStyleKeys = 'page' | 'card' | 'icon' | 'eyebrow' | 'actions';

const notFoundPageStyles: Record<NotFoundStyleKeys, SxProps<Theme>> = {
  page: (theme) => ({
    minHeight: `calc(100vh - ${theme.spacing(8)})`,
    display: 'flex',
    alignItems: 'center',
  }),
  card: (theme) => ({
    width: '100%',
    textAlign: 'center',
    paddingBlock: theme.spacing(5),
    paddingInline: theme.spacing(3),
    borderRadius: theme.shape.radius.extraSmall,
    [theme.breakpoints.up('sm')]: {
      paddingBlock: theme.spacing(7),
      paddingInline: theme.spacing(6),
    },
  }),
  icon: (theme) => ({
    fontSize: theme.spacing(8),
    color: theme.palette.text.primary,
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(10),
    },
  }),
  eyebrow: (theme) => ({
    letterSpacing: theme.typography.caption?.letterSpacing ?? '0.08em',
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
  }),
  actions: (theme) => ({
    paddingTop: theme.spacing(1),
    justifyContent: 'center',
  }),
};

const NotFound = (): ReactElement => {
  return (
    <Container component="section" maxWidth="md" sx={notFoundPageStyles.page}>
      <Paper elevation={3} sx={notFoundPageStyles.card}>
        <Stack spacing={3} alignItems="center">
          <SearchOffRoundedIcon sx={notFoundPageStyles.icon} aria-hidden="true" />
          <Stack spacing={1.5}>
            <Typography variant="overline" sx={notFoundPageStyles.eyebrow}>
              Pokedex Routing Error
            </Typography>
            <Typography variant="h2" component="h1">
              Page not found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The page you requested does not exist or is not available yet.
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={notFoundPageStyles.actions}
          >
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              startIcon={<HomeRoundedIcon />}
            >
              Return to Home
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotFound;
