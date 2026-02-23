# 📱 Catatan Penjualan - Aplikasi React Native (Expo)

Aplikasi pencatatan penjualan satu barang yang lengkap, dibuat dengan React Native + Expo.

---

## 🗂️ Struktur Folder

```
SalesApp/
├── App.js                          ← Entry point utama
├── app.json                        ← Konfigurasi Expo
├── package.json                    ← Dependencies
├── babel.config.js
└── src/
    ├── context/
    │   └── AppContext.js           ← State management global (AsyncStorage)
    ├── navigation/
    │   └── AppNavigator.js         ← Konfigurasi navigasi
    ├── screens/
    │   ├── DashboardScreen.js      ← Halaman utama & KPI
    │   ├── TambahTransaksiScreen.js← Input transaksi baru
    │   ├── TransaksiScreen.js      ← Daftar semua transaksi
    │   ├── DetailTransaksiScreen.js← Detail 1 transaksi
    │   ├── RekapScreen.js          ← Rekap bulanan + grafik
    │   └── PengaturanScreen.js     ← Pengaturan + Export CSV/JSON
    ├── components/
    │   └── UIComponents.js         ← Komponen UI reusable
    └── utils/
        ├── constants.js            ← Warna, font, spacing
        └── helpers.js              ← Fungsi helper
```

---

## ✨ Fitur Aplikasi

| Fitur | Keterangan |
|-------|-----------|
| 🏠 Dashboard | KPI utama: penjualan, keuntungan, margin, progress target |
| ➕ Tambah Transaksi | Input qty, pembeli, tanggal + kalkulasi otomatis |
| 📋 Daftar Transaksi | Cari, lihat, hapus transaksi |
| 📊 Rekap Bulanan | Statistik per bulan + grafik bar visual |
| 📤 Export CSV | Export ke Excel-compatible CSV |
| 💾 Backup JSON | Backup semua data ke file JSON |
| ⚙️ Pengaturan | Konfigurasi toko, harga, target, stok |
| 💾 Penyimpanan Lokal | Data tersimpan di HP (AsyncStorage) |

---

## 🚀 Cara Menjalankan

### 1. Install Node.js
Download di https://nodejs.org (versi 18 atau lebih baru)

### 2. Install Expo CLI
```bash
npm install -g expo-cli
```

### 3. Masuk ke folder proyek
```bash
cd SalesApp
```

### 4. Install semua dependency
```bash
npm install
```

### 5. Jalankan aplikasi
```bash
npx expo start
```

### 6. Buka di HP
- Install **Expo Go** di HP (Play Store / App Store)
- Scan QR code yang muncul di terminal
- Aplikasi langsung berjalan di HP Anda! 🎉

---

## 📦 Build APK (Android)

### Menggunakan EAS Build (Recommended):
```bash
# Install EAS CLI
npm install -g eas-cli

# Login Expo account (daftar gratis di expo.dev)
eas login

# Konfigurasi build
eas build:configure

# Build APK untuk Android
eas build --platform android --profile preview
```

### Output:
- File `.apk` yang bisa langsung diinstall di Android
- Atau `.aab` untuk upload ke Google Play Store

---

## 🔧 Kustomisasi

### Ganti warna tema:
Edit `src/utils/constants.js` → bagian `COLORS`

### Tambah fitur baru:
1. Buat screen baru di `src/screens/`
2. Daftarkan di `src/navigation/AppNavigator.js`
3. Tambah state baru di `src/context/AppContext.js` jika perlu

---

## 📱 Kompatibilitas

| Platform | Status |
|----------|--------|
| Android | ✅ Didukung |
| iOS | ✅ Didukung |
| Web | ⚠️ Parsial |

---

## 🛠️ Tech Stack

- **React Native** + **Expo SDK 51**
- **@react-navigation** - Navigasi antar halaman
- **AsyncStorage** - Penyimpanan data lokal
- **expo-sharing** + **expo-file-system** - Export file
- **date-fns** - Manipulasi tanggal

---

## 💡 Tips

- Data tersimpan otomatis di HP, tidak perlu internet
- Gunakan fitur "Backup JSON" sebelum uninstall app
- File CSV bisa langsung dibuka di Microsoft Excel / Google Sheets
- Untuk produksi, tambahkan fitur sinkronisasi cloud (Firebase/Supabase)
