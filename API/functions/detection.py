from fastapi import WebSocket
from dotenv import load_dotenv
import cv2
import torch
import os


load_dotenv()

model = None

THRESHOLD_SMOKE = os.getenv('THRESHOLD_SMOKE')
THRESHOLD_PERSON = os.getenv('THRESHOLD_PERSON')
STEP = int(os.getenv('STEP'))

async def stream (websocket: WebSocket):
  '''
  抽菸檢測 - 影像
  '''
  
  global model

  index = 1

  if model == None:
    model = torch.hub.load(
      'WongKinYiu/yolov7',
      'custom',
      'model/model.pt'
    )

  cap = cv2.VideoCapture(0)

  while True:
    success, frame = cap.read()
    
    if not success:
      break

    if index == STEP:
      image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

      result = model(image)
      detections = result.pandas().xyxy[0]
      smoke_detections = detections[detections['name'] == 'smoke']

      if len(smoke_detections) > 0:
        cv2.imwrite('temp/images/smoke.png', image)

        print('檢測到抽菸')
      
      index = 0

    index += 1

    success, buffer = cv2.imencode('.png', frame)
    frame = buffer.tobytes()

    await websocket.send_bytes(frame)
