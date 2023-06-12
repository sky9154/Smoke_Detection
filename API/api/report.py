from fastapi import APIRouter, File, UploadFile, HTTPException
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


@router.get('/report/get')
async def get ():
  if await report.get() is None:
    raise HTTPException(404, 'Report data not found')
  else:
    return await report.get()
