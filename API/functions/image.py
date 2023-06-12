import numpy  as np
import cv2


def process (image):
  '''
  調整影像大小
  '''
  
  height, width = image.shape[:2]
  aspect_ratio = width / height

  new_width = int(height * 5 / 4)
  new_aspect_ratio = 5 / 4

  if abs(aspect_ratio - new_aspect_ratio) > 0.001:
    pad = int((new_width - width) / 2)

    new_image = np.zeros((height, new_width, 3), np.uint8)
    new_image[:, pad:pad + width] = image

    image = new_image

  resized = cv2.resize(image, (600, 480), interpolation=cv2.INTER_AREA)

  return resized
