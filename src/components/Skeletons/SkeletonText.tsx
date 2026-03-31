import { Skeleton, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

interface SkeletonTextProps {
  variant: TypographyProps['variant'];
  width?: string | number;
}

const SkeletonText = ({ variant, width = '100%' }: SkeletonTextProps) => {
  return (
    <Skeleton variant="text" width={width}>
      <Typography variant={variant}>.</Typography>
    </Skeleton>
  );
};

export default SkeletonText;
