import toast from 'react-hot-toast';


/**
 * 傳送檢舉紀錄
 * @param message 內容
 * @param image 圖像
 */
const upload = async (message: string, image: File) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/report/upload`;
  const formData = new FormData();

  formData.append('message', message);
  formData.append('image', image);

  const requestOptions = {
    method: 'POST',
    body: formData
  };
  const loading = toast.loading('上傳中...',);

  await fetch(url, requestOptions).then(async (response: Response) => {
    if (response.ok) {
      toast.success('上傳成功!', { id: loading });
    }
  });
}

const report = {
  upload
}
export default report;