from time import gmtime, strftime
import csv
import cv2
import base64
import functions.image as func_image


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

  
async def get () -> (dict | None):
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

      return dict({
        'time': result['time'],
        'message': result['message'],
        'image': image
      })
    else:
      return None
