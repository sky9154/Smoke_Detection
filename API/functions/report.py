from fastapi import WebSocket
from datetime import datetime
import csv
import cv2
import uuid
import base64


name = ''

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

  global name

  with open('database/report.csv') as report:
    results = list(csv.DictReader(report))

    if len(results) != 0:
      result = results[-1]

      if name != result['image']:
        name = result['image']
        
        image = cv2.imread(f'temp/upload/{name}')

        success, buffer = cv2.imencode('.png', image)
        image = buffer.tobytes()
        image = base64.b64encode(image).decode('utf-8')

        await websocket.send_json({
          'head': 'report',
          'body': {
            'time': result['time'],
            'message': result['message'],
            'image': image
          }
        })
