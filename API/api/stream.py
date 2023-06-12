from fastapi import APIRouter, Response, WebSocket
from functions import detection


router = APIRouter()

@router.websocket('/stream')
async def camera (websocket: WebSocket, response: Response):
  response.headers['x-content-type-options'] = 'nosniff'

  try:
    await websocket.accept()
    await detection.stream(websocket)
  except Exception as e:
    print(f'ERROR:    {e}')
