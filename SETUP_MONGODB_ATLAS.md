# 🗄️ Setup MongoDB Atlas untuk TicketingKomplain

Panduan lengkap untuk menghubungkan aplikasi TicketingKomplain dengan MongoDB Atlas (cloud database).

---

## 📋 Langkah-langkah Setup

### **1️⃣ Buat Akun MongoDB Atlas**

1. Buka browser dan kunjungi: **https://www.mongodb.com/cloud/atlas/register**
2. Daftar menggunakan:
   - Email + Password, atau
   - Google Account (lebih cepat)
3. Verifikasi email Anda jika diminta

---

### **2️⃣ Buat Cluster Database (GRATIS)**

1. Setelah login, klik tombol **"Build a Database"** atau **"Create"**
2. Pilih **FREE tier (M0 Sandbox)**
   - ✅ Gratis selamanya
   - ✅ 512 MB storage
   - ✅ Cukup untuk development dan aplikasi kecil
3. **Pilih Cloud Provider & Region:**
   - **Provider**: AWS (recommended)
   - **Region**: Singapore (ap-southeast-1) atau Jakarta (untuk Indonesia)
4. **Cluster Name**: Biarkan default atau ganti (contoh: `TicketingCluster`)
5. Klik **"Create Cluster"**
6. ⏳ Tunggu 3-5 menit untuk provisioning

---

### **3️⃣ Setup Database User (Authentication)**

1. Di sidebar kiri, klik **"Database Access"** (di bawah menu Security)
2. Klik tombol **"Add New Database User"**
3. Pilih **"Password"** sebagai Authentication Method
4. **Buat Username dan Password:**
   ```
   Username: ticketing_admin
   Password: BuatPasswordKuatAnda123!
   ```
   ⚠️ **PENTING**: Catat username dan password ini dengan baik!
   
5. **Database User Privileges**: Pilih **"Read and write to any database"**
6. Klik **"Add User"**

---

### **4️⃣ Setup Network Access (IP Whitelist)**

1. Di sidebar kiri, klik **"Network Access"** (di bawah menu Security)
2. Klik tombol **"Add IP Address"**
3. **Untuk Development**: Pilih **"Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
   - Description: `Allow all (development)`
4. Klik **"Confirm"**

⚠️ **Catatan Keamanan**: 
- Untuk production, sebaiknya whitelist IP spesifik dari server Anda
- `0.0.0.0/0` membolehkan akses dari mana saja (hanya untuk development)

---

### **5️⃣ Dapatkan Connection String**

1. Kembali ke menu **"Database"** (di sidebar)
2. Klik tombol **"Connect"** pada cluster Anda
3. Pilih **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy Connection String** yang muncul, contohnya:
   ```
   mongodb+srv://ticketing_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### **6️⃣ Update File .env Backend**

1. Buka file `backend/.env`
2. Ganti `MONGODB_URI` dengan connection string dari Atlas
3. **Replace placeholders:**
   - `<username>` → username Anda (contoh: `ticketing_admin`)
   - `<password>` → password Anda (contoh: `BuatPasswordKuatAnda123!`)
   - `<cluster-url>` → URL cluster Anda (contoh: `cluster0.xxxxx.mongodb.net`)

**Contoh lengkap:**
```env
MONGODB_URI=mongodb+srv://ticketing_admin:BuatPasswordKuatAnda123!@cluster0.abc123.mongodb.net/ticketingkomplain?retryWrites=true&w=majority
```

⚠️ **PENTING**: 
- Pastikan tidak ada spasi di connection string
- Password harus di-encode jika mengandung karakter khusus (@, :, /, dll)
- Nama database `ticketingkomplain` sudah ditambahkan di akhir URL

---

### **7️⃣ Test Koneksi Database**

1. **Start Backend Server:**
   ```bash
   cd backend
   npm start
   ```

2. **Cek Console Output:**
   - ✅ Jika berhasil: `✅ Connected to MongoDB`
   - ❌ Jika gagal: Periksa connection string dan credentials

3. **Test API Endpoint:**
   Buka browser atau Postman:
   ```
   http://localhost:5900/api/debug/db
   ```
   
   Response yang diharapkan:
   ```json
   {
     "status": "connected",
     "database": "ticketingkomplain",
     "collection": "products",
     "totalProducts": 0,
     "products": []
   }
   ```

---

### **8️⃣ Seed Data (Opsional)**

Jika Anda memiliki script untuk seed data awal:

```bash
cd backend
node seed-admin.js
```

Ini akan membuat user admin default dan data awal lainnya.

---

## 🔧 Troubleshooting

### ❌ Error: "MongoServerError: bad auth"
**Solusi:**
- Periksa username dan password di connection string
- Pastikan user sudah dibuat di Database Access
- Pastikan password tidak mengandung karakter khusus yang tidak di-encode

### ❌ Error: "MongooseServerSelectionError"
**Solusi:**
- Periksa Network Access whitelist
- Pastikan IP `0.0.0.0/0` sudah ditambahkan
- Periksa koneksi internet Anda

### ❌ Error: "Invalid connection string"
**Solusi:**
- Pastikan format connection string benar
- Tidak ada spasi di connection string
- Gunakan `mongodb+srv://` bukan `mongodb://`

### 🔐 Password dengan Karakter Khusus
Jika password mengandung karakter khusus, encode dengan URL encoding:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`

**Contoh:**
```
Password asli: Pass@123!
Password encoded: Pass%40123!
```

---

## 📊 Monitoring Database

### **Melihat Data di Atlas:**
1. Login ke MongoDB Atlas
2. Klik **"Browse Collections"** pada cluster Anda
3. Pilih database `ticketingkomplain`
4. Lihat collections: `products`, `users`, `tickets`, dll

### **Metrics & Performance:**
1. Klik tab **"Metrics"** pada cluster
2. Monitor:
   - Connections
   - Operations per second
   - Network usage
   - Storage usage

---

## 🚀 Next Steps

Setelah database terkoneksi:

1. ✅ Test semua API endpoints
2. ✅ Seed data awal (products, admin user)
3. ✅ Test frontend connection
4. ✅ Deploy backend ke production (Vercel, Railway, dll)
5. ✅ Update MONGODB_URI di environment variables production

---

## 📝 Catatan Penting

- ✅ **Backup**: MongoDB Atlas otomatis backup untuk free tier
- ✅ **Security**: Jangan commit file `.env` ke Git
- ✅ **Production**: Gunakan IP whitelist spesifik, bukan `0.0.0.0/0`
- ✅ **Monitoring**: Cek usage di Atlas dashboard secara berkala

---

## 🆘 Butuh Bantuan?

- 📖 Dokumentasi: https://docs.mongodb.com/atlas/
- 💬 Support: https://support.mongodb.com/
- 🎓 Tutorial: https://university.mongodb.com/

---

**Happy Coding! 🎉**
