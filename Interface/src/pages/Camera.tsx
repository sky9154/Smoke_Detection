import {
  FC
} from 'react';
import Grid from '@mui/material/Unstable_Grid2';


const Camera: FC = () => {

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        mt: '50px'
      }}
    >
      <img
        src='https://dummyimage.com/1280x720/FFF.png&text=+'
        alt="video"
        style={{
          width: '80%',
          borderRadius: 16,
          boxShadow: '0 4px 8px 0 #BDC9D7'
        }}
      />
    </Grid>
  );
}

export default Camera;