from fastapi import APIRouter, File, UploadFile, Response, WebSocket
import uuid
import functions.report as report


router = APIRouter()

@router.post('/report/upload')
async def upload (
  message: str = File(...),
  image: UploadFile = File(...)
):
  name = f'{uuid.uuid4()}.png'

  with open(f'temp/upload/{name}', 'wb') as buffer:
    buffer.write(await image.read())

  await report.write(message, name)


@router.websocket('/report/get')
async def get (websocket: WebSocket, response: Response):
  response.headers['x-content-type-options'] = 'nosniff'

  try:
    await websocket.accept()
    await report.get(websocket)
  except Exception as e:
    print(f'ERROR:    {e}')
