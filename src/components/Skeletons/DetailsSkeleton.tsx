import type { ReactElement } from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import PageContainer from "@/components/Layout/PageContainer";
import SkeletonText from "./SkeletonText";
import { skeleton } from "@/theme/tokens/skeleton";

const styles: Record<string, SxProps<Theme>> = {
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },
  heroInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  infoTable: (theme: Theme) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.radius.extraSmall,
    p: 2,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1,
    opacity: 0.3,
  }),
  chips: {
    display: "flex",
    gap: 1,
    minHeight: skeleton.chip.containerHeight,
  },
  statRow: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  evolutionContainer: (theme: Theme) => ({
    backgroundColor: theme.palette.grey[800],
    borderRadius: theme.shape.radius.extraSmall,
    p: { xs: 2, sm: 3 },
    mb: 4,
  }),
  evolutionChain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 1,
    mt: 2,
  },
  evolutionCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
  evolutionImage: (theme: Theme) => ({
    width: theme.spacing(18),
    height: theme.spacing(18),
  }),
};

const StatRowSkeleton = (): ReactElement => (
  <Box sx={styles.statRow}>
    <Skeleton variant="text" sx={{ minWidth: (theme: Theme) => theme.spacing(16) }}>
      <SkeletonText variant="caption" />
    </Skeleton>
    <SkeletonText variant="caption" width={32} />
    <Skeleton variant="rounded" sx={{ flex: 1, height: (theme: Theme) => theme.spacing(1) }} />
  </Box>
);

const EvolutionCardSkeleton = (): ReactElement => (
  <Box sx={styles.evolutionCard}>
    <Skeleton variant="circular" sx={styles.evolutionImage} />
    <SkeletonText variant="caption" width={skeleton.text.idWidth} />
    <SkeletonText variant="body2" width={skeleton.text.nameWidth} />
    <Box sx={styles.chips}>
      <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
    </Box>
  </Box>
);

const DetailsSkeleton = (): ReactElement => {
  return (
    <PageContainer>
      {/* NavigationBar */}
      <Box sx={styles.navBar}>
        <SkeletonText variant="caption" width={100} />
        <SkeletonText variant="caption" width={100} />
      </Box>

      {/* HeroSection */}
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton variant="rounded" width="100%" sx={{ aspectRatio: "1 / 1" }} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={styles.heroInfo}>
            <SkeletonText variant="caption" width={skeleton.text.idWidth} />
            <SkeletonText variant="h2" width={skeleton.text.nameWidth} />
            <Box>
              <SkeletonText variant="body2" />
              <SkeletonText variant="body2" />
              <SkeletonText variant="body2" width="60%" />
            </Box>
            <Box sx={styles.infoTable}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Box key={i}>
                  <SkeletonText variant="caption" width="50%" />
                  <SkeletonText variant="body2" width="70%" />
                </Box>
              ))}
            </Box>
            <Box>
              <SkeletonText variant="caption" width={32} />
              <Box sx={styles.chips}>
                <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
                <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
              </Box>
            </Box>
            <Box>
              <SkeletonText variant="caption" width={72} />
              <Box sx={styles.chips}>
                <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
                <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
                <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* StatBars */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 4 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <StatRowSkeleton key={i} />
        ))}
      </Box>

      {/* EvolutionSection */}
      <Box sx={styles.evolutionContainer}>
        <SkeletonText variant="h4" width={120} />
        <Box sx={styles.evolutionChain}>
          <EvolutionCardSkeleton />
          <SkeletonText variant="h4" width={16} />
          <EvolutionCardSkeleton />
          <SkeletonText variant="h4" width={16} />
          <EvolutionCardSkeleton />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default DetailsSkeleton;
