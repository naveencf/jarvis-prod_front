
import { Skeleton } from '@mui/material';

const ShimmerLoader = ({ rows = 5, width = "100%", height = 10 }) => {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={width} 
          height={height} 
          sx={{ marginBottom: '10px' }} 
        />
      ))}
    </div>
  );
};

export default ShimmerLoader;
