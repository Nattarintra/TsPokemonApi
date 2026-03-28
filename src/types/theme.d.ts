import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Shape {
        radius: {
            none: number;
            extraSmall: number;
            small: number;
            medium: number;
            large: number;
            full: number;
        };
    }
}