from fastapi import APIRouter, Response, WebSocket
from functions import detection, report
import cv2


router = APIRouter()

@router.websocket('/stream')
async def camera (websocket: WebSocket, response: Response):
  response.headers['x-content-type-options'] = 'nosniff'

  try:
    await websocket.accept()

    cap = cv2.VideoCapture(0)
  
    while True:
      success, frame = cap.read()
      
      if not success:
        continue

      await detection.stream(websocket, frame)
      await report.get(websocket)
  except Exception as e:
    print(f'ERROR:    {e}')
