#!/usr/bin/env bash
# build image ของ frontend แล้ว export เป็นไฟล์ .tar (ทำเฉพาะฝั่งเครื่องตัวเอง ยังไม่ส่งขึ้น VM)
set -euo pipefail
cd "$(dirname "$0")"

IMAGE="ethics-deploy-frontend"
TAG="$(date +%Y-%m-%d-%H%M)"
OUT="ethics-frontend.tar"

# Dockerfile build โค้ดด้วย npm run build ข้างในอยู่แล้ว จึงไม่ต้อง build ซ้ำนอก Docker
docker build -t "$IMAGE:latest" -t "$IMAGE:$TAG" .
docker save -o "$OUT" "$IMAGE:latest"

echo "เสร็จแล้ว: $OUT ($(du -h "$OUT" | cut -f1)) tag สำรอง: $IMAGE:$TAG"
