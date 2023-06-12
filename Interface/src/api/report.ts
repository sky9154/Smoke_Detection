interface ReportMessage {
  time: string,
  message: string
}

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

  await fetch(url, requestOptions);
}

const get = async (
  loading: (loading: boolean) => void,
  message: (message: ReportMessage) => void,
  image: (image: string) => void
) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/report/get`;

  await fetch(url).then(async (response: Response) => {
    const result: {
      time: string,
      message: string,
      image: string
    } = await response.json();

    if (response.ok) {
      loading(true);
      
      message({
        time: result.time,
        message: result.message
      });

      image(`data:image/png;base64,${result.image}`);
    }
  });
}

const report = {
  upload,
  get
}
export default report;