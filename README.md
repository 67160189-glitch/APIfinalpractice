# โปรเจกต์ซ้อมสอบ: Express + MySQL + Jest

โปรเจกต์ฝึกขนาดเล็ก แยกจาก `final-exam-setup` เดิม ใช้ฝึกพื้นฐาน route, SQL, validation และการทดสอบ API ตัวอย่างนี้เป็นแบบฝึก ไม่ใช่โจทย์จริง

จากแผนวิชา ภาคปฏิบัติระบุหัวข้อ Testing/Validation และใช้ทักษะ Express + MySQL + Jest จึงควรฝึกเพิ่มการทดสอบกรณีผิดพลาดและ input ไม่ถูกต้องด้วย แต่ไม่สามารถยืนยันได้ว่าโจทย์จริงจะออกตามตัวอย่างนี้

## โครงสร้าง

- `app.js` — API สองเส้นทาง: ดูเมนูและสร้างออร์เดอร์
- `server.js` — เปิด HTTP server แยกจาก app เพื่อให้ Supertest ทดสอบได้
- `db.js`, `config.js` — การตั้งค่าและ MySQL connection pool
- `app.test.js` — ตัวอย่าง Jest/Supertest โดย mock MySQL
- `docker-compose.yml`, `seed.sql` — ฐานข้อมูลฝึกแยก ใช้พอร์ต `3310`

## เริ่มใช้งาน

เปิด terminal ที่โฟลเดอร์นี้ แล้วรัน:

```bash
npm install
docker compose up -d
npm test
npm start
```

คัดลอก `.env.example` เป็น `.env` ได้ถ้าต้องการปรับค่าการเชื่อมต่อ ค่าเริ่มต้นของโปรเจกต์นี้ใช้ MySQL port `3310` จึงไม่ชนกับ setup เดิมที่ใช้ `3309`

บน Windows Command Prompt สามารถคัดลอกไฟล์ตั้งค่าได้ด้วย `copy .env.example .env` (อย่า commit ไฟล์ `.env`)

ทดสอบ API ขณะ `npm start` ทำงาน:

```bash
curl http://localhost:3001/menu
curl -X POST http://localhost:3001/orders -H "Content-Type: application/json" -d "{\"customer_name\":\"Mali\"}"
```

## ลองฝึกเอง

1. ใน `app.js` เปลี่ยนให้ `GET /menu` รองรับ query `?available=false` แล้วเพิ่ม test
2. เพิ่มการตรวจ `customer_name` ที่ยาวเกิน 100 ตัวอักษร แล้วทดสอบว่าได้ `400`
3. เพิ่ม test เมื่อ MySQL query ล้มเหลว แล้วตรวจว่า API ตอบ `500` โดยไม่เปิดเผย error ภายใน

ข้อสอบจริงประกาศว่าไม่ให้ใช้ AI ช่วยตอบหรือเขียนโค้ดระหว่างสอบ ให้ใช้ชุดนี้ซ้อมทำความเข้าใจก่อนสอบ และทำข้อสอบด้วยตนเองตามกติกา

## จำแพตเทิร์น

```js
const [rows] = await pool.query("SELECT ...");
return res.status(200).json(rows);
```

```js
if (ข้อมูลไม่ถูกต้อง) {
  return res.status(400).json({ error: "..." });
}
```

```js
await pool.query("INSERT INTO table_name (column_name) VALUES (?)", [value]);
```

ใช้ `?` แทนค่าที่มาจากผู้ใช้ใน SQL เสมอ และทุกเส้นทางควรตอบกลับทั้งกรณีสำเร็จและผิดพลาด
