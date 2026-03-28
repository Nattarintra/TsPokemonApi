import type { ReactElement } from "react";
import { Grid } from "@mui/material";
import PokemonCardSkeleton from "./PokemonCardSkeleton";
import { SKELETON_COUNT } from "@/constants";


const PokemonGridSkeleton = (): ReactElement => {
    return (
        <Grid container spacing={5} sx={{ width: "80%", margin: "20px auto" }}>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                    <PokemonCardSkeleton />
                </Grid>
            ))}
        </Grid>
    );
};

export default PokemonGridSkeleton;