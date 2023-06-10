from time import gmtime, strftime
import csv
import cv2


async def write (message: str, image: str):
  '''
  寫入檢舉紀錄
  '''
  
  with open('database/report.csv', 'a+', newline='') as report:
    writer = csv.writer(report)
    
    writer.writerow([
      strftime('%Y-%m-%d %H:%M:%S', gmtime()),
      message,
      image
    ])

  
async def get (websocket):
  '''
  取出檢舉紀錄
  '''

  while True:
    with open('database/report.csv', newline='') as report:
      results = list(csv.DictReader(report))

      result = dict({
        'time': '',
        'message': ''
      } if len(results) == 0 else {
        'time': results[-1]['time'],
        'message': results[-1]['message']
      })

      await websocket.send_json(result)

      if len(results) != 0:
        image = cv2.imread(f'temp/upload/{results[-1]["image"]}')

        success, buffer = cv2.imencode('.jpg', image)
        image = buffer.tobytes()

        await websocket.send_bytes(image)
