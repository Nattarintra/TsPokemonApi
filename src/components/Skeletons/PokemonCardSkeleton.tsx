import { Card as MuiCard, CardContent, Skeleton, Box } from "@mui/material";
import type { ReactElement } from "react";
import type { Theme } from "@mui/material/styles";
import { skeleton } from "@/theme/tokens/skeleton";



const pokemonCardSkeletonStyles = {
    boxImage: {
        width: "100%",
        aspectRatio: "1 / 1",
    },

    boxChips: (theme: Theme) => ({
        display: "flex",
        gap: theme.spacing(1),
        mt: theme.spacing(1),
        minHeight: theme.spacing(3),
    }),
};
const PokemonCardSkeleton = (): ReactElement => {
    return (
        <MuiCard>

            <Box
                sx={pokemonCardSkeletonStyles.boxImage}
            >
                <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>

            <CardContent>

                <Skeleton variant="text" width={skeleton.text.idWidth} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={skeleton.text.nameWidth} sx={{ mb: 1 }} />

                <Box sx={pokemonCardSkeletonStyles.boxChips}>
                    <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
                    <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
                </Box>
            </CardContent>
        </MuiCard>
    );
};

export default PokemonCardSkeleton;