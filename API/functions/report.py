from fastapi import WebSocket
from datetime import datetime
import csv
import cv2
import uuid
import base64
import functions.image as func_image


async def write (message: str, image) -> None:
  '''
  寫入檢舉紀錄
  '''

  currentDateTime = datetime.now()
  name = f'{uuid.uuid4()}.png'

  with open(f'temp/upload/{name}', 'wb') as buffer:
    buffer.write(image)
  
  with open('database/report.csv', 'a+', newline='') as report:
    writer = csv.writer(report)

    writer.writerow([
      currentDateTime.strftime('%Y-%m-%d %H:%M:%S'),
      message,
      name
    ])


async def get (websocket: WebSocket) -> (dict | None):
  '''
  取出檢舉紀錄
  '''

  with open('database/report.csv') as report:
    results = list(csv.DictReader(report))

    if len(results) != 0:
      result = results[-1]
      image = cv2.imread(f'temp/upload/{result["image"]}')

      image = func_image.process(image)

      success, buffer = cv2.imencode('.png', image)
      image = buffer.tobytes()
      image = base64.b64encode(image).decode('utf-8')

      await websocket.send_json(dict({
        'time': result['time'],
        'message': result['message'],
        'image': image
      }))
    else:
      return None
