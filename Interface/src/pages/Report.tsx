import { FC, useState, ChangeEvent } from 'react';
import { BiCloudUpload, BiSend } from 'react-icons/bi';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import { H2 } from '../components/Typography';
import report from '../api/report';


const Report: FC = () => {
  const [message, setMessage] = useState<string>('');
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const image = event.target.files[0];

      setUploadImage(image);
      setImageUrl(URL.createObjectURL(image));
    }
  };

  const handleUpload = async () => {
    if (uploadImage) {
      await report.upload(message, uploadImage);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Stack
        direction="column"
        mt={15}
        spacing={2}
        width="70%"
      >
        <H2>檢舉說明</H2>
        <TextField
          type="text"
          multiline
          rows={3}
          value={message}
          onChange={handleMessageChange}
        />
        <label htmlFor="image" style={{ width: '100%', height: '100%' }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="image"
            onChange={handleImageChange}
          />
          <Button
            variant="contained"
            component="span"
            fullWidth
            startIcon={<BiCloudUpload />}
          >
            上傳照片
          </Button>
        </label>
        <H2>照片預覽</H2>
        <Box>
          {(imageUrl === '') ? (
            <Skeleton
              variant="rounded"
              width="100%"
              height={150}
            />
          ) : (
            <img
              src={imageUrl}
              alt="uploadImage"
              width="100%"
              height={150}
            />
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<BiSend />}
          onClick={handleUpload}
        >
          送出
        </Button>
      </Stack>
    </Box>
  );
}

export default Report;