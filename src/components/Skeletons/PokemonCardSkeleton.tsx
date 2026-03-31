import { Skeleton, Box, type Theme } from '@mui/material';
import type { ReactElement } from 'react';
import PokemonCardLayout from '@/components/Cards/PokemonCardLayout';
import { skeleton } from '@/theme/tokens/skeleton';
import SkeletonText from './SkeletonText';

const chipStyles = (theme: Theme) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  minHeight: skeleton.chip.containerHeight,
});

const PokemonCardSkeleton = (): ReactElement => {
  return (
    <PokemonCardLayout
      image={<Skeleton variant="rectangular" width="100%" height="100%" />}
      content={
        <>
          <SkeletonText variant="caption" width={skeleton.text.idWidth} />

          <Box sx={{ mt: 1, mb: 1 }}>
            <SkeletonText variant="h2" width={skeleton.text.nameWidth} />
          </Box>

          <Box sx={chipStyles}>
            <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
            <Skeleton variant="rounded" width={skeleton.chip.width} height={skeleton.chip.height} />
          </Box>
        </>
      }
    />
  );
};

export default PokemonCardSkeleton;
