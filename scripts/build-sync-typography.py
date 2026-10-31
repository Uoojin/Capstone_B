"""Regenerate the captured SVG typography from the preserved sync_opate.webm.

Requires: imageio-ffmpeg, opencv-python-headless, numpy.
Run from the repository root. No font file, bitmap or video is embedded in SVG.
"""
import gzip
import json
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LEVELS = 32
FPS = 30000 / 1001  # Exact source timebase, displayed as 29.97 by FFmpeg.
cv2.setNumThreads(1)
source = imageio_ffmpeg.read_frames(str(ROOT / 'src/assets/sync_opate.webm'), pix_fmt='rgb24')
metadata = next(source)
width, height = metadata['size']
frames = []
for pixels in source:
    image = np.frombuffer(pixels, dtype=np.uint8).reshape(height, width, 3)
    alpha = np.clip((253 - image[:, :, 1].astype(np.float32)) / 253, 0, 1)
    alpha = cv2.GaussianBlur(alpha, (0, 0), .35)
    frame = []
    for level in range(1, LEVELS + 1):
        mask = (alpha >= (level - .5) / LEVELS).astype(np.uint8) * 255
        mask = cv2.resize(mask, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST)
        contours, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
        pieces = []
        for contour in contours:
            if abs(cv2.contourArea(contour)) < 2:
                continue
            points = cv2.approxPolyDP(contour, .9, True).reshape(-1, 2)
            if len(points) < 3:
                continue
            x, y = points[0]
            path = f'M{x / 2 - .25:g} {y / 2 - .25:g}'
            for xx, yy in points[1:]:
                dx, dy = int(xx - x), int(yy - y)
                if dx == 0:
                    path += f'v{dy / 2:g}'
                elif dy == 0:
                    path += f'h{dx / 2:g}'
                else:
                    path += f'l{dx / 2:g} {dy / 2:g}'
                x, y = xx, yy
            pieces.append(path + 'z')
        frame.append(''.join(pieces))
    frames.append(frame)
motion = dict(fps=FPS, duration=round(len(frames) / FPS, 6), width=width, height=height, levels=LEVELS)
raw = json.dumps({**motion, 'frames': frames}, separators=(',', ':')).encode()
(ROOT / 'src/assets/sync-typography-motion.bin').write_bytes(gzip.compress(raw, compresslevel=9, mtime=0))
(ROOT / 'src/pages/Home/sync-motion-first-frame.json').write_text(
    json.dumps({**motion, 'frame': frames[0]}, separators=(',', ':')))
print(f'{len(frames)} SVG frames / {len(frames) / FPS:.3f}s / {width}×{height}')
