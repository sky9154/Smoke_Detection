from fastapi import Response
from dotenv import load_dotenv
import requests
import os


load_dotenv()

LINE_NOTIFY_TOKEN = os.getenv('LINE_NOTIFY_TOKEN')

def line_notify (message: str) -> Response:
  '''
  發送 Line Notify
  '''
  
  headers = {
    'Authorization': f'Bearer {LINE_NOTIFY_TOKEN}'
  }

  payload = {
    'message': message
  }

  files = {
    'imageFile': open('temp/images/smoke.png', 'rb')
  }

  response = requests.post(
    'https://notify-api.line.me/api/notify',
    headers=headers,
    data=payload,
    files=files
  )

  return response
