---
title: 'West Lake CTF: YUSA’s Little Secret'
translation_id: yusa-little-secret
source_digest: aa1653f2cbc1bb53276008b91f751ff41efbd92e65d38676fd346777884c4d54
tags:
  - Misc
  - Steganography
  - Color Spaces
categories:
  - Cybersecurity
  - CTF
sections: {"yusas-little-secret": "yusa的小秘密"}
---

## Misc

### YUSA’s little secret

[Download the challenge files](https://cdn.jsdelivr.net/gh/noneSycamore/annex/yusa_small_secret.zip)

The clue was roughly: “LSB, but not quite LSB. Everyone knows there’s more than RGB...” Opening the image in StegSolve, I could already make out the flag in two channels, but there was far too much noise to read it clearly.

That clue sent me looking at other colour spaces. [Hardcore Watermark 01, a Misc challenge from ByteCTF 2020](https://bytectf.feishu.cn/docs/doccnqzpGCWH1hkDf5ljGdjOJYg#qHRUCR), gave me a useful lead.

> A pixel can be represented by three channels. Red, green and blue are familiar examples; the channels used in this challenge are Y, Cr and Cb.

I used `cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)` to convert the image from BGR to YCrCb, then saved the result.

```python
from cv2 import cv2
img = cv2.imread('Yusa.png')
cv_color = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
cv2.imwrite('img.png', cv_color)
```

Then I reopened the saved image in StegSolve and inspected its channels.

![Inspecting the converted image channels in StegSolve](https://res.cloudinary.com/sycamore/image/upload/v1792696489/Typora/2026/09/0c489cb73329a1ef49146321f8fde3bd.png)
