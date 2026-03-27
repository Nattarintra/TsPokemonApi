import { Box, Button, Typography, Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import type { SxProps, Theme } from "@mui/material";

type ErrorVariant = "inline" | "fullscreen";

interface ErrorBannerProps {
    message: string;
    onRetry?: () => void;
    isRetrying?: boolean;
    variant?: ErrorVariant;
}

const errorBannerStyles = {
    container: (isFullscreen: boolean): SxProps<Theme> => (theme) => ({
        minHeight: isFullscreen ? "100vh" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(2),
    }),

    card: (theme: Theme) => ({
        padding: {
            xs: theme.spacing(2),
            sm: theme.spacing(3),
        },
        borderRadius: theme.shape.radius.extraSmall,
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
        textAlign: "center",

        width: "100%",
        maxWidth: {
            xs: "100%",
            sm: 400,
        },
    }),

    icon: (theme: Theme) => ({
        fontSize: {
            xs: theme.spacing(4),
            sm: theme.spacing(5),
        },
    }),

    message: (theme: Theme) => ({
        fontSize: {
            xs: theme.spacing(1.5),
            sm: theme.spacing(2),
        },
    }),

    button: (theme: Theme) => ({
        fontSize: {
            xs: theme.spacing(1.5),
            sm: theme.spacing(1.8),
        },
    }),
};

const ErrorBanner = ({
    message,
    onRetry,
    isRetrying = false,
    variant = "inline",
}: ErrorBannerProps) => {

    const isFullscreen = variant === "fullscreen";

    return (
        <Box sx={errorBannerStyles.container(isFullscreen)}>
            <Stack spacing={2} alignItems="center" sx={errorBannerStyles.card}>
                <ErrorOutlineIcon sx={errorBannerStyles.icon} />
                <Typography variant="body1" sx={errorBannerStyles.message}>{message}</Typography>

                {onRetry && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onRetry}
                        disabled={isRetrying}
                        sx={errorBannerStyles.button}
                    >
                        {isRetrying ? "Retrying..." : "Try again"}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ErrorBanner;