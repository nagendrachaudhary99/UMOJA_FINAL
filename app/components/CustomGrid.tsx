import React from 'react';
import { Grid, GridProps } from '@mui/material';

// The CustomGrid component is needed because the standard Grid component
// in MUI v5 doesn't properly type the 'item' prop, causing TypeScript errors
interface CustomGridProps extends Omit<GridProps, 'item'> {
  item?: boolean;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
}

const CustomGrid: React.FC<CustomGridProps> = (props) => {
  return <Grid {...props} />;
};

export default CustomGrid; 