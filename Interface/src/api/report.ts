const report = async (message: string, image: File) => {
  const url = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/report/upload`;
  const formData = new FormData();

  formData.append('message', message);
  formData.append('image', image);

  await fetch(url, {
    method: 'POST',
    body: formData
  });
}

export default report;