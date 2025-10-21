# 🚀 OLoan Auto-Startup Setup Guide

## วิธีติดตั้งให้เว็บรันอัตโนมัติเมื่อเปิดเครื่อง

### 📋 **Step 1: ติดตั้ง Windows Service (ทำครั้งเดียว)**

1. **คลิกขวาที่ `install-windows-service.bat`**
2. **เลือก "Run as administrator"**
3. **รอให้ติดตั้งเสร็จ**

```bash
# หรือรันใน Command Prompt (Admin)
install-windows-service.bat
```

### ✅ **ผลลัพธ์หลังติดตั้ง:**
- ✅ ระบบจะเริ่มอัตโนมัติเมื่อเปิดเครื่อง
- ✅ Docker Desktop จะเปิดอัตโนมัติ
- ✅ PostgreSQL Database จะรันอัตโนมัติ
- ✅ Next.js Web App จะรันอัตโนมัติ
- ✅ Cloudflare Tunnel จะเปิดอัตโนมัติ

---

## 🔧 **การจัดการระบบ**

### **ตรวจสอบสถานะ:**
```bash
check-startup-status.bat
```

### **ถอนการติดตั้ง Auto-Startup:**
```bash
# คลิกขวา "Run as administrator"
uninstall-windows-service.bat
```

### **เริ่มระบบด้วยตนเอง:**
```bash
# Production Mode (Docker + DB)
start-oloan.bat

# Development Mode (In-memory data)
start-oloan-dev.bat
```

### **หยุดระบบ:**
```bash
stop-oloan.bat        # หยุด Production
stop-oloan-dev.bat    # หยุด Development
```

---

## 📊 **สิ่งที่เกิดขึ้นเมื่อเปิดเครื่อง**

1. **Windows Boot** → Windows Task Scheduler เริ่มงาน
2. **รอ 30 วินาที** → ให้ระบบ Boot เสร็จ
3. **เปิด Docker Desktop** → รอให้พร้อมใช้งาน (สูงสุด 2 นาที)
4. **รัน `docker-compose up -d --build`** → เริ่ม Web + Database
5. **เริ่ม Cloudflare Tunnel** → เชื่อมต่อ Global Access
6. **แสดง Notification** → แจ้งเตือนว่าระบบพร้อม

---

## 🌐 **URLs หลังจากเปิดเครื่อง**

### **Local Access:**
- http://localhost:4000 (หน้าหลัก)
- http://localhost:4000/adminLoan (Admin Dashboard)

### **Global Access (ทั่วโลก):**
- https://oloan-payment.trycloudflare.com (หน้าหลัก)
- https://oloan-payment.trycloudflare.com/adminLoan (Admin Dashboard)

---

## 📝 **Log Files**

ระบบจะสร้างไฟล์ Log เพื่อติดตาม:
- `startup.log` - Log การเริ่มระบบ
- `tunnel.log` - Log Cloudflare Tunnel

---

## ⚡ **Fallback System**

หาก Docker ไม่สามารถเริ่มได้:
- ระบบจะเปลี่ยนเป็น **Development Mode** อัตโนมัติ
- ใช้ **In-memory data** แทน PostgreSQL
- ยังคงมี **Cloudflare Tunnel** สำหรับ Global Access

---

## 🔧 **Troubleshooting**

### **ปัญหา: Docker ไม่เริ่ม**
```bash
# ตรวจสอบ Docker Desktop
"C:\Program Files\Docker\Docker\Docker Desktop.exe"

# หรือใช้ Development Mode
start-oloan-dev.bat
```

### **ปัญหา: Cloudflare Tunnel ไม่เชื่อมต่อ**
```bash
# ตรวจสอบ credentials file
C:\Users\locky\.cloudflared\194e2f58-902a-4241-ac22-62f2e78919e6.json

# ทดสอบ tunnel
cloudflared tunnel --config tunnel.yml run
```

### **ปัญหา: Port 4000 ถูกใช้งาน**
```bash
# หา process ที่ใช้ port 4000
netstat -ano | findstr :4000

# หยุด process
taskkill /f /pid [PID]
```

---

## ✅ **การทดสอบ Auto-Startup**

1. **ติดตั้ง Windows Service**
2. **Restart เครื่อง**
3. **รอ 2-3 นาที**
4. **เปิด browser ไปที่ http://localhost:4000**
5. **ทดสอบ Global URL: https://oloan-payment.trycloudflare.com**

---

**🎯 หลังจากติดตั้ง: ระบบจะรันอัตโนมัติทุกครั้งที่เปิดเครื่อง โดยไม่ต้องทำอะไรเพิ่มเติม!**
