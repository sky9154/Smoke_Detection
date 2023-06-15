import { FC, useState, useEffect, useRef } from 'react';
import Zoom from 'react-medium-image-zoom';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { Paragraph } from '../components/Typography';


interface ReportMessage {
  time: string,
  message: string
}


const Camera: FC = () => {
  const cameraRef = useRef<WebSocket | null>(null);

  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [smokeLoading, setSmokeLoading] = useState<boolean>(false);
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  const [camera, setCamera] = useState<string>('');
  const [smoke, setSmoke] = useState<string>('');
  const [reportImage, setReportImage] = useState<string>('');
  const [reportMessage, setReportMessage] = useState<ReportMessage>({
    time: '',
    message: ''
  });

  const closeSocket = () => {
    if (cameraRef.current) {
      setCameraLoading(false);
      setSmokeLoading(false);
      setReportLoading(false);

      cameraRef.current.close();
    }
  };

  useEffect(() => {
    cameraRef.current = new WebSocket(`ws://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/ws/stream`);
    cameraRef.current.binaryType = 'arraybuffer';

    cameraRef.current.onmessage = (event) => {
      if (typeof (event.data) === 'string') {
        try {
          setReportLoading(true);

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
        } catch (error) {
          setSmokeLoading(true);

          setSmoke(`data:image/png;base64,${event.data}`);
        }
      } else {
        setCameraLoading(true);

        const blob = new Blob([event.data], { type: 'image/jpeg' });
        const frame = URL.createObjectURL(blob);

        setCamera(frame);
      }
    };

    return () => closeSocket();
  }, []);

  return (
    <Stack
      direction="column"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      spacing={4}
      mt={6}
    >
      <Stack
        direction="row"
        display="flex"
        justifyContent="center"
        width="80%"
        spacing={4}
      >
        {(cameraLoading) ? (
          <img
            src={camera}
            alt="video"
            width="640px"
            height="480px"
            style={{ borderRadius: 16 }}
          />
        ) : (
          <Skeleton
            variant="rounded"
            width="640px"
            height="480px"
          />
        )}
        {(smokeLoading) ? (
          <img
            src={smoke}
            alt="video"
            width="640px"
            height="480px"
            style={{ borderRadius: 16 }}
          />
        ) : (
          <Skeleton
            variant="rounded"
            width="640px"
            height="480px"
          />
        )}
      </Stack>
      <Stack
        direction="row"
        display="flex"
        justifyContent="center"
        width="80%"
        spacing={4}
      >
        {(reportLoading) ? (
          <>
            <Zoom>
              <img
                src={reportImage}
                alt="reportImage"
                width="320px"
                height="240px"
                style={{ borderRadius: 16 }}
              />
            </Zoom>
            <Paragraph width="320px">
              檢舉時間:<br />
              {reportMessage.time}
              <br />
              <br />
              檢舉內容:<br />
              {reportMessage.message}
            </Paragraph>
          </>
        ) : (
          <>
            <Skeleton
              variant="rounded"
              width="320px"
              height="240px"
            />
            <Paragraph width="320px">
              <Skeleton width="320px" />
              <Skeleton width="240px" />
            </Paragraph>
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default Camera;