from fastapi import WebSocket
from dotenv import load_dotenv
import cv2
import torch
import os
import base64
import functions.notification as notification


load_dotenv()

model = None
index = 1

THRESHOLD_SMOKE = os.getenv('THRESHOLD_SMOKE')
THRESHOLD_PERSON = os.getenv('THRESHOLD_PERSON')
STEP = int(os.getenv('STEP'))

async def stream (websocket: WebSocket, frame):
  '''
  抽菸檢測 - 影像
  '''

  global model, index

  if model == None:
    model = torch.hub.load(
      'WongKinYiu/yolov7',
      'custom',
      'model/model.pt'
    )

  success, buffer = cv2.imencode('.png', frame)
  image_bytes = buffer.tobytes()

  if index == STEP:
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = model(image)
    detections = result.pandas().xyxy[0]
    smoke_detections = detections[detections['name'] == 'smoke']

    if len(smoke_detections) > 0:
      cv2.imwrite('temp/images/smoke.png', frame)

      # notification.line_notify('檢測到抽菸')

      smoke_image = base64.b64encode(image_bytes).decode('utf-8')

      await websocket.send_text(smoke_image)
    
    print('檢測到抽菸')
    
    index = 0

  index += 1

  await websocket.send_bytes(image_bytes)
