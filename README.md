# OLoan Payment System

ระบบเว็บแอปสำหรับ "ลิงก์แจ้งยอดชำระหนี้ลูกค้า" โดยไม่มีการล็อกอิน รองรับการใช้งานฟรี 100% บนเครื่อง PC ผ่าน Docker + Cloudflare Free Tunnel

## 🚀 คุณสมบัติ

- **Frontend:** Next.js 14 (App Router)
- **Backend:** Node.js + Express API Routes
- **Database:** PostgreSQL (Docker Container)
- **UI:** TailwindCSS + Noto Sans Thai Font
- **Dark/Light Mode:** อัตโนมัติตาม system preference
- **Mobile Responsive:** รองรับ iOS Safari, Android Chrome
- **Free Hosting:** Docker + Cloudflare Tunnel

## 📱 หน้าเว็บ

- `http://localhost:4000` → Welcome page
- `http://localhost:4000/adminLoan` → Dashboard Admin
- `http://localhost:4000/customer/[id]` → หน้าชำระเงินลูกค้า (3 Steps)

## 🛠️ การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. เริ่มต้น Development Server (ใช้ In-Memory Data)

```bash
npm run dev
```

ระบบจะทำงานด้วย in-memory data ทันที ไม่ต้องติดตั้ง database

### 3. ติดตั้ง PostgreSQL (Optional - สำหรับ Production)

#### Option A: ใช้ Docker (แนะนำ)
```bash
# เริ่ม PostgreSQL
docker-compose up postgres -d

# เริ่มทั้งระบบ
docker-compose up --build
```

#### Option B: ติดตั้ง PostgreSQL ในเครื่อง
```bash
# Windows (ใช้ Chocolatey)
choco install postgresql

# หรือดาวน์โหลดจาก: https://www.postgresql.org/download/windows/

# สร้าง Database
createdb -U postgres oloan_db_b

# สร้าง User
psql -U postgres -c "CREATE USER oloan_user WITH PASSWORD 'oloan_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE oloan_db_b TO oloan_user;"

# Import Schema
psql -U oloan_user -d oloan_db_b -f init.sql
```

#### Option C: ใช้ Cloud Database (Supabase, Neon, etc.)
```bash
# สร้าง .env.local
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🌐 Cloudflare Tunnel Setup (Free)

### 1. ติดตั้ง Cloudflared

```bash
# Windows
winget install --id Cloudflare.cloudflared

# macOS
brew install cloudflared

# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Login และสร้าง Tunnel

```bash
# Login to Cloudflare
cloudflared tunnel login

# สร้าง tunnel
cloudflared tunnel create oloan-payment

# เริ่มต้น tunnel
cloudflared tunnel --config tunnel.yml run
```

### 3. Config File (tunnel.yml)

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: ~/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: your-domain.trycloudflare.com
    service: http://localhost:4000
  - service: http_status:404
```

### 4. เริ่มต้น Tunnel

```bash
# Development
cloudflared tunnel --url http://localhost:4000

# Production
cloudflared tunnel run oloan-payment
```

## 📊 Database Schema

```sql
CREATE TABLE public.bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  amount NUMERIC NOT NULL,
  due_date DATE,
  lender TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🎨 UI Features

### Mobile-First Design
- **Section 1:** ยอดที่ต้องชำระ (Gradient Background)
- **Section 2:** ข้อมูลเงินกู้ (Collapsible)
- **Section 3:** ชำระเงินกู้คืน วงเงินเพิ่ม (Collapsible)
- **Section 4:** ปุ่มหลัก "ชำระเงินกู้"
- **Bottom Navigation:** 3 เมนู

### Dark/Light Mode
- อัตโนมัติตาม `prefers-color-scheme`
- ไม่มีปุ่มสลับธีม
- ปรับสี background, text, buttons อัตโนมัติ

### 3-Step Payment Flow
1. **Step 1:** แสดงข้อมูลบิล
2. **Step 2:** เลือกวิธีชำระ + จำนวนเงิน
3. **Step 3:** แสดง QR Code ชำระเงิน

## 🔧 Environment Variables

```bash
DATABASE_URL=postgresql://oloan_user:oloan_password@localhost:5432/oloan_db_b
NODE_ENV=production
```

## 📝 Sample Data

ระบบมีข้อมูลทดสอบ:
- `BJEq2RBWpLclk1iSRT8A` - นายสมชาย ใจดี (฿10,000)
- `test-bill-001` - นางสาวสมหญิง รักเรียน (฿15,000)
- `test-bill-002` - นายประชา สุขใจ (฿8,500)
- `test-bill-003` - นางวิไล มั่งมี (฿25,000)

## 🚀 Production Deployment

```bash
# Build และ Deploy
docker-compose up --build -d

# เช็ค Status
docker-compose ps

# ดู Logs
docker-compose logs -f app
```

## 📱 Mobile Testing

ทดสอบบน:
- iOS Safari
- Android Chrome
- WebView (iOS/Android)
- Desktop Browsers

## 🎯 Performance

- รองรับผู้ใช้พร้อมกัน 20+ คน
- SPA Routing (Fast Navigation)
- Optimized Images
- Mobile-First CSS

## 🔒 Security

- ไม่มีระบบ Authentication
- Public Links เท่านั้น
- Database Connection Pooling
- Environment Variables

---

**หมายเหตุ:** ใส่ QR Code image ที่ `public/images/qrcode.jpg` ก่อนใช้งาน
