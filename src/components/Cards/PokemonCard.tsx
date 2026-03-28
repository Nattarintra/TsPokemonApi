import type { ReactElement } from "react";
import { Card as MuiCard, CardMedia, CardContent, Typography, Box, Chip, type SxProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { pokemonTypeColors, type PokemonType } from "@/theme/tokens";
import type { PokemonCardProps } from "@/types/pokemon.type";


export const PokemonCardStyle = {
    typeBackgroundColor:
        (type: PokemonType): SxProps<Theme> =>
            (theme) => ({
                textTransform: "capitalize",
                backgroundColor: pokemonTypeColors[type],
                color: theme.palette.getContrastText(
                    pokemonTypeColors[type]
                ),
            }),

    boxImage: {
        width: "100%",
        aspectRatio: "1 / 1",
        overflow: "hidden",
    },
};


const PokemonCard = ({ id, name, image, types }: PokemonCardProps): ReactElement => {
    return (
        <MuiCard >
            <Box sx={PokemonCardStyle.boxImage}>
                <CardMedia component="img" image={image} alt={name} />
            </Box>

            <CardContent>
                <Typography variant="caption" color="text.secondary">
                    #{id.toString().padStart(4, "0")}
                </Typography>
                <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                    {name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {types.map((type) => (
                        <Chip
                            key={type}
                            label={type}
                            sx={PokemonCardStyle.typeBackgroundColor(type as PokemonType)}
                        />
                    ))}
                </Box>
            </CardContent>
        </MuiCard>
    );
};

export default PokemonCard;