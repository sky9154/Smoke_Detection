from fastapi import APIRouter, File, UploadFile
from time import gmtime, strftime
import uuid
import csv


router = APIRouter()

@router.post('/report')
async def report (
  message: str = File(...),
  image: UploadFile = File(...)
):
  name = uuid.uuid4()

  with open(f'temp/upload/{name}.png', 'wb') as buffer:
    buffer.write(await image.read())

  with open('database/report.csv', 'a+', newline='') as report:
    writer = csv.writer(report)
    
    writer.writerow([
      strftime("%Y-%m-%d %H:%M:%S", gmtime()),
      message,
      f'{name}.png'
    ])
