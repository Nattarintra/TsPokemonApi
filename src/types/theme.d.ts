import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Shape {
        radius: {
            none: number;
            small: number;
            medium: number;
            large: number;
            full: number;
        };
    }
}