# สเต็ปที่ 1: สร้างสภาพแวดล้อม Node.js เพื่อ Build โค้ด
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# สเต็ปที่ 2: นำโค้ดที่ Build เสร็จแล้วไปใส่ Nginx
FROM nginx:alpine
# ก๊อปปี้ไฟล์หน้าเว็บจากสเต็ปแรก (โฟลเดอร์ dist) มาใส่ Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# นำกฎจราจร Nginx ของเราไปทับของเดิม
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]