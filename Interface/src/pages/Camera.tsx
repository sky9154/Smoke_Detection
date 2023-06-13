import { FC, useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import { Paragraph } from '../components/Typography';


interface ReportMessage {
  time: string,
  message: string
}


const Camera: FC = () => {
  const cameraRef = useRef<WebSocket | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [camera, setCamera] = useState<string>('');
  const [reportImage, setReportImage] = useState<string>('');
  const [reportMessage, setReportMessage] = useState<ReportMessage>({
    time: '',
    message: ''
  });

  const closeSocket = () => {
    if (cameraRef.current) {
      setLoading(false);

      cameraRef.current.close();
    }
  };

  useEffect(() => {
    cameraRef.current = new WebSocket(`ws://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/ws/stream`);
    cameraRef.current.binaryType = 'arraybuffer';

    cameraRef.current.onmessage = (event) => {
      setLoading(true);

      if (typeof (event.data) === 'string') {
        const result: {
          time: string,
          message: string,
          image: string
        } = JSON.parse(event.data);

        setReportMessage({
          time: result.time,
          message: result.message
        });
  
        setReportImage(`data:image/png;base64,${result.image}`);
      } else {
        const blob = new Blob([event.data], { type: 'image/jpeg' });
        const frame = URL.createObjectURL(blob);
  
        setCamera(frame);
      }
    };

    return () => closeSocket();
  }, []);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      spacing={4}
      mt={6}
    >
      <Grid xs={12} width="100%" justifyContent="center">
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
        >
          {(loading) ? (
            <img
              src={camera}
              alt="video"
              width="1280px"
              height="720px"
              style={{ borderRadius: 16 }}
            />
          ) : (
            <Skeleton
              variant="rounded"
              width="1280px"
              height="720px"
            />
          )}
        </Box>
      </Grid>
      <Grid xs={12} width="100%" justifyContent="center" >
        <Stack
          direction="row"
          display="flex"
          justifyContent="center"
          width="100%"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={4}
        >
          {(loading) ? (
            <img
              src={reportImage}
              alt="reportImage"
              width="300px"
              height="240px"
              style={{ borderRadius: 16 }}
            />
          ) : (
            <Skeleton
              variant="rounded"
              width="300px"
              height="240px"
            />
          )}
          <Paragraph width="300px">
            {(loading) ? (
              <>
                檢舉時間:<br />
                {reportMessage.time}
                <br />
                檢舉內容:<br />
                {reportMessage.message}
              </>
            ) : (
              <>
                <Skeleton width="300px" />
                <Skeleton width="240px" />
              </>
            )}
          </Paragraph>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Camera;