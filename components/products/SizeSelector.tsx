import React, { FC } from 'react';
import { ICartProduct, ISize } from '../../interfaces';
import { Box, Button } from '@mui/material';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  tempCartProduct: ICartProduct;
  setTempCartProduct(tempCartProduct: ICartProduct): void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, tempCartProduct, setTempCartProduct }) => {
  return (
    <Box>
      {sizes.map((size: ISize) => (
        <Button key={size} size="small" color={selectedSize === size ? 'primary' : 'inherit'} onClick={() => setTempCartProduct({ ...tempCartProduct, size })}>
          {size}
        </Button>
      ))}
    </Box>
  );
};
