# Buku Kas — Aplikasi Manajemen Keuangan Pribadi

## Cara pakai
Buka `index.html` di browser. Tidak perlu install apa pun dan **tidak butuh internet** (kecuali font Google, yang punya cadangan otomatis).
Data tersimpan di browser (localStorage); gunakan **Backup / Restore** untuk memindahkan data. Klik **? Panduan** di aplikasi untuk penjelasan lengkap.

## Fitur
- Tampilan tablet ala dashboard: bingkai membulat, menu di takik atas, 3 kolom (saldo & dompet | ikhtisar & transaksi | aksi cepat, peta pengeluaran, aktivitas), dock 3 pil di bawah; otomatis menyesuaikan tablet & HP
- Mode privasi: ikon 👁 menyamarkan angka saldo
- 5 menu: Beranda, Transaksi, Dompet, Analitik, Rencana (menu bawah di HP, tombol `1`–`5` di keyboard)
- 7 tema warna: Krem, Mint, Lavender, Samudra, Senja, Hutan Malam, Midnight (🎨 atau tekan `T`; pilih langsung di ⚙ Pengaturan)
- Dompet: pantau saldo DANA, GoPay, OVO, ShopeePay, LinkAja, BCA, Mandiri, BRI, BNI, Jago, SeaBank, tunai, dll. (saldo diisi manual, tidak terhubung ke bank demi privasi)
- Beranda: grafik ikhtisar harian dengan tooltip, aksi cepat, kartu total saldo, gauge tabungan, ring anggaran, transaksi terbaru; Analitik memuat aktivitas terbaru
- Latar dinamis (menu ✦): titik jatuh, cahaya mengikuti mouse, keduanya, atau mati
- Kategori ditebak otomatis dari keterangan transaksi
- Tren 6 bulan, wawasan otomatis, target tabungan, aturan 50/30/20, anggaran bulanan
- Export Excel 4 sheet (Ringkasan, Transaksi, Anggaran, Dompet & target) dengan rumus hidup dan 4 grafik Excel asli
- Pintasan: `Enter` tambah · `/` cari · `←` `→` ganti bulan · `T` tema · `?` panduan

## Isi folder
- `index.html` — halaman utama
- `css/style.css` — tampilan (tema terang/gelap, efek kaca)
- `js/app.js` — logika inti (transaksi, anggaran, backup)
- `js/extra.js` — tema, panduan, tren, wawasan, target tabungan, tombol export
- `js/ui.js` — menu, tema, beranda, dompet, aktivitas
- `js/bg.js` — latar dinamis
- `js/report.js` + `js/xlsx.js` — pembuat file Excel (mandiri, tanpa library)
- `database/schema.sql` — template MySQL/MariaDB (opsional; tabel `savings_goals` cocok dengan fitur Target tabungan)

## Menghubungkan ke database (opsional)
Buat API (Node/PHP/Laravel) di atas `schema.sql`, lalu ganti fungsi `save()` dan pemuatan `S` di `js/app.js` dengan `fetch()` ke API tersebut.
