import * as React from 'react';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

export default function TableSkeleton() {
  return (
    <Stack spacing={0.5} sx={{  height:600 ,m:4}}>
      <Skeleton width={510} height={80}/>
      <Skeleton height={60}   animation="wave" />
      <Skeleton height={60}   animation={false} />
      <Skeleton height={60} />
      <Skeleton height={60} animation="wave" />
      <Skeleton height={60} animation={false} />
      <Skeleton height={60} />
      <Skeleton height={60} animation="wave" />
      {/* <Skeleton height={60} animation={false} /> */}
      {/* <Skeleton height={60} /> */}
      {/* <Skeleton height={60} animation="wave" /> */}
    </Stack>
  );
}