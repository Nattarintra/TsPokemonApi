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
    container: (isFullscreen: boolean): SxProps<Theme> => ({
        minHeight: isFullscreen ? "100vh" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }),

    card: (): SxProps<Theme> => (theme) => ({
        padding: theme.spacing(3),
        borderRadius: theme.shape.radius.extraSmall,
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
        textAlign: "center",
        maxWidth: theme.spacing(50), // ~400px
        width: "100%",
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
            <Stack spacing={2} alignItems="center" sx={errorBannerStyles.card()}>
                <ErrorOutlineIcon fontSize="large" />
                <Typography variant="body1">{message}</Typography>

                {onRetry && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onRetry}
                        disabled={isRetrying}
                    >
                        {isRetrying ? "Retrying..." : "Try again"}
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default ErrorBanner;