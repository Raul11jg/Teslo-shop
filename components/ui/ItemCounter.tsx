import { FC, useState } from 'react';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
  maxValue: number;
  currentValue?: number;
  updatedQuantity: (value: number) => void;
}
export const ItemCounter: FC<Props> = ({ maxValue, currentValue = 1, updatedQuantity }) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => {
          if (currentValue !== 1) updatedQuantity(--currentValue);
        }}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
      <IconButton
        onClick={() => {
          if (currentValue < maxValue) updatedQuantity(++currentValue);
        }}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
