from fastapi import APIRouter, File, UploadFile
import asyncio
import functions.report as report


router = APIRouter()

@router.post('/report/upload')
async def upload (
  message: str = File(..., encoding='utf-8'),
  image: UploadFile = File(...)
):
  image = await image.read()
  asyncio.create_task(report.write(message, image))
